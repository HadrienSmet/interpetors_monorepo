import { FilesActionsStore, FolderStructure, VocabularyTerm } from "@repo/types";

import { uploadFile } from "@/modules/pdf";
import { VOCABULARY } from "@/modules/vocabulary";
import { handleServicesConcurrency } from "@/utils";

import { prepareJobs } from "./prepareJobs";

const runAPI = handleServicesConcurrency(5);

type UploadPreparationParams = {
    readonly folders: Array<FolderStructure>;
    readonly foldersActions: FilesActionsStore;
    readonly preparationId: string;
    readonly rootFolderId?: string;
    readonly userKey: CryptoKey;
    readonly vocabularyTerms: Array<VocabularyTerm>;
    readonly workspaceId: string;
};
export const uploadPreparation = async ({
    folders,
    foldersActions,
    preparationId,
    userKey,
    vocabularyTerms,
    workspaceId,
}: UploadPreparationParams) => {
    // 1) Aplatir les jobs (un job par PDF)
    const jobs = await prepareJobs(folders, foldersActions, preparationId, userKey, vocabularyTerms);

    // 2) Traiter chaque job via un pool d'API (et sous-pool S3)
    await Promise.all(jobs.map(job => (runAPI(async () => {
        const fileRes = await uploadFile({
            ...job.s3,
            ...job.pdf,
        });

        if (job.terms.length) {
            const terms = job.terms.map(t => ({
                ...t,
                occurrence: { ...t.occurrence, pdfFileId: fileRes.id },
            }));
            await VOCABULARY.postBulk({
                workspaceId,
                preparationId,
                terms,
            });
        }
    }))));
};
