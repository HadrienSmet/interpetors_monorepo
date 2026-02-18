import { bytesToBase64, COMPRESSION_FORMAT, gzipBytes, safeBuffer, utf8ToBytes } from "../compression";

export const chunkBytes = (bytes: Uint8Array, maxChunkBytes: number): Uint8Array[] => {
	if (maxChunkBytes <= 0) throw new Error("maxChunkBytes must be > 0");

	const output: Uint8Array[] = [];
	for (let i = 0; i < bytes.length; i += maxChunkBytes) {
		output.push(bytes.subarray(i, Math.min(bytes.length, i + maxChunkBytes)));
	}

	return (output);
};

export type UploadChunk = {
	readonly checksum: string;
	readonly chunkB64: string;
	readonly encoding: typeof COMPRESSION_FORMAT;
	readonly index: number;
	readonly total: number;
	readonly uploadId: string;
};
const uuid = () => crypto.randomUUID();
const sha256 = async (bytes: Uint8Array): Promise<string> => {
	const buffer = safeBuffer(bytes);
	const hash = await crypto.subtle.digest("SHA-256", buffer);

	return (bytesToBase64(new Uint8Array(hash)));
};
const utf8JsonSize = (obj: unknown): number => new TextEncoder().encode(JSON.stringify(obj)).length;

type ComputeMaxPartBytesParams = {
	readonly checksum: string;
	readonly maxChunkRequestBytes: number;
	readonly maxPartBytes?: number;
	readonly minPartBytes?: number;
	readonly total: number; // approximation initiale (on recalcule derrière)
	readonly uploadId: string;
};
/**
 * Calcule une taille max de part (en bytes gz) telle que le JSON final du chunk
 * reste <= maxChunkRequestBytes (limite côté serveur pour éviter 413).
 */
const computeMaxPartBytes = ({
	checksum,
	uploadId,
	total,
	maxChunkRequestBytes,
	minPartBytes = 256,
	maxPartBytes = 512 * 1024,
}: ComputeMaxPartBytesParams): number => {
	// On mesure avec un chunk “pire cas” :
	// - index & total avec un nb de digits réaliste
	// - payload de taille variable
	const worstIndex = Math.max(0, total - 1);

	const fits = (partBytesLen: number): boolean => {
		// Base64 length = ceil(n/3)*4
		const b64Len = Math.ceil(partBytesLen / 3) * 4;
		// pas besoin de construire une vraie string de b64 pour mesurer :
		// MAIS la taille JSON dépend du contenu (échappements) -> pour base64 c’est stable (A-Z a-z 0-9 + / =)
		// donc on peut simuler avec "A".repeat(b64Len)
		const simulatedChunk: UploadChunk = {
			checksum,
			chunkB64: "A".repeat(b64Len),
			encoding: COMPRESSION_FORMAT,
			index: worstIndex,
			total,
			uploadId,
		};

		return (utf8JsonSize(simulatedChunk) <= maxChunkRequestBytes);
	};

	// Si même minPartBytes ne passe pas, c’est qu’il faut augmenter la limite serveur
	// ou changer de transport (multipart/binaire).
	if (!fits(minPartBytes)) {
		throw new Error(
			`Chunk metadata alone exceeds maxChunkRequestBytes=${maxChunkRequestBytes}. ` +
			`Increase server body limit or change transport (multipart/binary).`
		);
	}

	// Recherche binaire pour trouver la plus grande taille qui passe.
	let low = minPartBytes;
	let high = maxPartBytes;

	while (low < high) {
		// upper mid pour éviter boucle infinie
		const mid = Math.floor((low + high + 1) / 2);
		if (fits(mid)) low = mid;
		else high = mid - 1;
	}

	return (low);
};
export const prepareCompressedChunks = async (
	data: string,
	opts?: {
		/**
		 * Taille max du body HTTP (en bytes UTF-8) par requête chunk,
		 * i.e. ce que body-parser / Nest va mesurer.
		 *
		 * Si ton serveur est à 100kb, vise 90-95kb pour marge headers/variations.
		 */
		maxChunkRequestBytes?: number;

		/**
		 * Plafond “hard” pour ne pas tenter des parts absurdes.
		 * Purement client-side.
		 */
		maxPartBytesCeiling?: number;
	}
): Promise<Array<UploadChunk>> => {
	// Par défaut: safe pour une limite serveur de 100kb (102400)
	const maxChunkRequestBytes = opts?.maxChunkRequestBytes ?? 95_000;
	const maxPartBytesCeiling = opts?.maxPartBytesCeiling ?? 512 * 1024;

	const gz = await gzipBytes(utf8ToBytes(data));
	const checksum = await sha256(gz);
	const uploadId = uuid();

	// 1) Estimation initiale de total pour le calcul du pire cas (digits de total)
	// On prend un total pessimiste: si chunks ~ 64kb => total ~ gz/64kb.
	const approxTotal = Math.max(1, Math.ceil(gz.length / 64_000));
	// 2) Calcule une taille de part (bytes gz) qui garantira que le JSON du chunk <= maxChunkRequestBytes
	let maxPartBytes = computeMaxPartBytes({
		checksum,
		uploadId,
		total: approxTotal,
		maxChunkRequestBytes,
		maxPartBytes: maxPartBytesCeiling,
	});

	// 3) On découpe une première fois
	let parts = chunkBytes(gz, maxPartBytes);

	// 4) Maintenant qu’on connaît le total réel, on recalcule maxPartBytes (total peut avoir plus de digits)
	// et on redécoupe si nécessaire.
	const realTotal = parts.length;
	const refinedMaxPartBytes = computeMaxPartBytes({
		checksum,
		uploadId,
		total: realTotal,
		maxChunkRequestBytes,
		maxPartBytes: maxPartBytesCeiling,
	});

	if (refinedMaxPartBytes !== maxPartBytes) {
		maxPartBytes = refinedMaxPartBytes;
		parts = chunkBytes(gz, maxPartBytes);
	}

	const total = parts.length;

	// 5) On construit les chunks et on assert qu’on ne dépasse pas (sécurité)
	const chunks: UploadChunk[] = parts.map((part, index) => ({
		checksum,
		chunkB64: bytesToBase64(part),
		encoding: COMPRESSION_FORMAT,
		index,
		total,
		uploadId,
	}));

	for (const chunk of chunks) {
		const size = utf8JsonSize(chunk);
		if (size > maxChunkRequestBytes) {
			// Should never happen - better to prevent to perform useless request
			throw new Error(`Chunk ${chunk.index + 1}/${chunk.total} exceeds maxChunkRequestBytes: ${size} > ${maxChunkRequestBytes}`);
		}
	}

	return (chunks);
};
