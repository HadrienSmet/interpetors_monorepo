import { FILES } from "@/modules/files";
import { handleServicesConcurrency } from "@/utils";

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
    const pdfRes = await FILES.postPdf({ actions, filePath, name, preparationId, s3Key: s3Res.data.key });
    if (!pdfRes.success) {
        throw new Error(`postPdf failed for "${name}": ${pdfRes.message}`);
    }

    return (pdfRes.data);
};
