import { FolderStructure, VocabularyTerm } from "@repo/types";

import { uploadFile } from "@/modules/pdf";
import { VOCABULARY } from "@/modules/vocabulary";
import { handleServicesConcurrency } from "@/utils";

import { prepareJobs } from "./prepareJobs";

const runAPI = handleServicesConcurrency(5);

type UploadPreparationParams = {
    readonly folders: Array<FolderStructure>;
    readonly preparationId: string;
    readonly rootFolderId?: string;
    readonly vocabularyTerms: Array<VocabularyTerm>;
    readonly workspaceId: string;
};
export const uploadPreparation = async ({
    folders,
    preparationId,
    vocabularyTerms,
    workspaceId,
}: UploadPreparationParams) => {
    // 1) Aplatir les jobs (un job par PDF)
    const jobs = prepareJobs(folders, preparationId, vocabularyTerms);

    // 2) Traiter chaque job via un pool d'API (et sous-pool S3)
    await Promise.all(jobs.map(job => (runAPI(async () => {
        const fileRes = await uploadFile({
            ...job.s3,
            ...job.pdf,
        });

        if (job.terms.length) {
            await VOCABULARY.postBulk({
                workspaceId,
                preparationId,
                terms: job.terms.map(t => ({
                    ...t,
                    occurrence: { ...t.occurrence, pdfFileId: fileRes.id },
                })),
            });
        }
    }))));
};
