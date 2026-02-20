import { FILES } from "@/modules/files";
import { handleServicesConcurrency, prepareCompressedChunks } from "@/utils";

const runS3 = handleServicesConcurrency(3);

type UploadFileParams = {
    readonly actions: string;
    readonly contentType: string;
    readonly file: File;
    readonly filePath: string;
    readonly name: string;
    readonly preparationId: string;
};
export const uploadFile = async ({
    actions,
    contentType,
    file,
    filePath,
    name,
    preparationId,
}: UploadFileParams) => {
    // a) PUT S3 (pool S3)
    const s3Res = await runS3(() => FILES.upload({
        contentType,
        file,
        fileName: name,
    }));
    if (!s3Res.success) {
        throw new Error(`S3 upload failed for "${name}": ${s3Res.message}`);
    }

    // b) Création PdfFile (DB)
    const pdfRes = await FILES.postPdf({ filePath, name, preparationId, s3Key: s3Res.data.key });
    if (!pdfRes.success) {
        throw new Error(`postPdf failed for "${name}": ${pdfRes.message}`);
    }

	const chunks = await prepareCompressedChunks(actions);
	const responses = await Promise.all([...chunks.map(chunk => FILES.postActionChunk({ preparationId, fileId: pdfRes.data.id, body: chunk }))]);
	const chunksRes = [];
	for (const res of responses) {
		if (!res.success) {
			throw new Error("An error occured while uploading the file actions");
			// TODO: clean db to prevent stale data or retry
		}

		chunksRes.push(res.data);
	}

	const completeIndex = chunksRes.findIndex(el => {
		if ("completed" in el && el.completed) return (true);

		return (false);
	});
	if (completeIndex === -1) {
		throw new Error("Did not succeed to upload all the actions chunks");
		// TODO: clean db to prevent stale data or retry
	}


    return (pdfRes.data);
};
