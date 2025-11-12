import { FolderStructure, VocabularyTerm } from "@repo/types";

import { FILE_ACTION } from "@/modules/fileActions";
import { FILES } from "@/modules/files";
import { VOCABULARY } from "@/modules/vocabulary";
import { handleServicesConcurrency } from "@/utils";

import { prepareJobs } from "./prepareJobs";

const runS3 = handleServicesConcurrency(3);
const runAPI = handleServicesConcurrency(5);
const runAct = handleServicesConcurrency(5);

type UploadPreparationParams = {
    readonly folders: Array<FolderStructure>;
    readonly preparationId: string;
    readonly rootFolderId?: string;
    readonly vocabularyTerms: Array<VocabularyTerm>;
    readonly workspaceId: string;
};
export const newUploadPreparation = async ({
    folders,
    preparationId,
    vocabularyTerms,
    workspaceId,
}: UploadPreparationParams) => {
    // 1) Aplatir les jobs (un job par PDF)
    const jobs = prepareJobs(folders, preparationId, vocabularyTerms);

    // 2) Traiter chaque job via un pool d'API (et sous-pool S3)
    await Promise.all(jobs.map(job => (runAPI(async () => {
        // a) PUT S3 (pool S3)
        const s3Res = await runS3(() => FILES.upload(job.s3));
        if (!s3Res.success) {
            throw new Error(`S3 upload failed for "${job.s3.fileName}": ${s3Res.message}`);
        }

        // b) Création PdfFile (DB)
        const pdfRes = await FILES.postPdf({ ...job.pdf, s3Key: s3Res.data.key });
        if (!pdfRes.success) {
            throw new Error(`postPdf failed for "${job.s3.fileName}": ${pdfRes.message}`);
        }

        const { id: fileId } = pdfRes.data;

        // c) FileActions (nombreux petits appels => pool dédié)
        if (job.filesActions.length) {
            await Promise.all(
                job.filesActions.map(a =>
                    runAct(() => FILE_ACTION.post({ ...a, fileId }))
                )
            );
        }

        // d) Vocabulaire (bulk par fichier)
        if (job.terms.length) {
            await VOCABULARY.postBulk({
                workspaceId,
                preparationId,
                terms: job.terms.map(t => ({
                    ...t,
                    occurrence: { ...t.occurrence, pdfFileId: fileId },
                })),
            });
        }
    }))));
};
