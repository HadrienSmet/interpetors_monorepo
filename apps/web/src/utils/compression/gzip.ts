import { safeBuffer } from "./utils";

export const COMPRESSION_FORMAT = "gzip";
export const gunzipBytes = async (input: Uint8Array): Promise<Uint8Array> => {
	const buffer = safeBuffer(input);
	// ✅ Modern browsers
	const decompressionStream = new DecompressionStream(COMPRESSION_FORMAT);
	const stream = new Blob([buffer])
		.stream()
		.pipeThrough(decompressionStream);
	const arrayBuffer = await new Response(stream).arrayBuffer();

	return (new Uint8Array(arrayBuffer));
};
export const gzipBytes = async (input: Uint8Array): Promise<Uint8Array> => {
	const buffer = safeBuffer(input);
	// ✅ Modern browsers
	const compressionStream = new CompressionStream(COMPRESSION_FORMAT);
	const stream = new Blob([buffer])
		.stream()
		.pipeThrough(compressionStream);
	const arrayBuffer = await new Response(stream).arrayBuffer();

	return (new Uint8Array(arrayBuffer));
};
