import { FilesActionsStore, FolderStructure, VocabularyTerm } from "@repo/types";

import { FILES } from "@/modules/files";
import { isPdfMetadata } from "@/modules/folders";
import { PDF_TYPE } from "@/modules/pdf";
import { encryptActions, encryptPdfFile, encryptVocabularyTerms, VocToPost } from "@/utils";

type PdfFileJob = 
	& Omit<FILES.PostPdfParams, "s3Key">
	& { readonly actions: string; };
type FlatJob = {
    pdf: PdfFileJob;
    s3: FILES.UploadParams;
    terms: Array<VocToPost>;
};
type Queue = { path: string; node: FolderStructure; };

const FIRST_LEVEL_PATH = "";

const handleFirstPathChar = (path: string) => (
	path.startsWith("/")
        ? path
        // Happens on file at root
        : `/${path}`
);

/**
 * Flatten Array<FolderStructure> into a list of jobs to:
 *  - create PdfFile and VocabularyTerms and FileActions,
 *  - to store File in S3 bucket
 */
export const prepareJobs = async (
    folders: Array<FolderStructure>,
    foldersActions: FilesActionsStore,
    preparationId: string,
    userKey: CryptoKey,
    vocabularyTerms: Array<VocabularyTerm> = []
): Promise<Array<FlatJob>> => {
    const jobs: Array<FlatJob> = [];

    const queue: Array<Queue> = folders.map(node => ({ path: FIRST_LEVEL_PATH, node }));

    while (queue.length) {
        const { path, node } = queue.shift()!;

        for (const [name, value] of Object.entries(node)) {
            if (isPdfMetadata(value)) {
                const fullPath = path ? `${path}/${value.name}` : `/${value.name}`;
                const filePath = path;

                const getTems = async (voc: Array<VocabularyTerm>) => {
                    const filtered = voc.filter(t => {
                        const occFilePath = handleFirstPathChar(t.occurrence.filePath);
                        const safePath = handleFirstPathChar(fullPath)

                        return (occFilePath === safePath);
                    });

					const encrypted = await encryptVocabularyTerms(userKey, filtered);

					return (encrypted);
                };

                const terms = await getTems(vocabularyTerms);
				const actions = await encryptActions(userKey, foldersActions[value.id] ?? {});
				const file = await encryptPdfFile(value.file, userKey);

                jobs.push({
                    pdf: {
                        actions,
                        filePath,
                        name: value.name,
                        preparationId,
                    },
                    s3: {
                        contentType: PDF_TYPE.type,
                        file,
                        fileName: value.name,
                    },
                    terms,
                });

                continue;
            }

            const childPath = path
                ? `${path}/${name}`
                : name;
            queue.push({ path: childPath, node: value });
        }
    }

    return (jobs);
};
