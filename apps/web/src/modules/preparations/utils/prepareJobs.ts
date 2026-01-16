import { FilesActionsStore, FolderStructure, VocabularyTerm } from "@repo/types";

import { FILES } from "@/modules/files";
import { isPdfMetadata } from "@/modules/folders";
import { PDF_TYPE } from "@/modules/pdf";
import { encryptJson, encryptPdfFile, encryptString } from "@/utils";

type PdfFileJob = Omit<FILES.PostPdfParams, "s3Key">;
type FlatJob = {
    pdf: PdfFileJob;
    s3: FILES.UploadParams;
    terms: Array<VocabularyTerm>;
};
type Queue = { path: string; node: FolderStructure; };

const FIRST_LEVEL_PATH = "";

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

    const queue: Queue[] = folders.map(node => ({ path: FIRST_LEVEL_PATH, node }));

    while (queue.length) {
        const { path, node } = queue.shift()!;

        for (const [name, value] of Object.entries(node)) {
            if (isPdfMetadata(value)) {
                const fullPath = path ? `${path}/${value.name}` : `/${value.name}`;
                const filePath = path;

                const handleFirstPathChar = (path: string) => (
                    path[0] === "/"
                        ? path
                        // Happens on file at root
                        : `/${path}`
                );

                const getTems = async (voc: Array<VocabularyTerm>) => {
                    const filtered = voc.filter(t => {
                        const occFilePath = handleFirstPathChar(t.occurrence.filePath);
                        const safePath = handleFirstPathChar(fullPath)

                        return (occFilePath === safePath);
                    });

                    const output: Array<VocabularyTerm> = [];
                    for (const t of filtered) {
                        const encryptedRef = await encryptString(userKey, t.occurrence.text);
                        output.push({
                            ...t,
                            occurrence: {
                                ...t.occurrence,
                                text: JSON.stringify(encryptedRef),
                            },
                        });
                    }

                    return (output);
                };

                const terms = await getTems(vocabularyTerms);
                const actions = foldersActions[value.id] ?? {};
                const encryptedActions = await encryptJson(userKey, actions);

                jobs.push({
                    pdf: {
                        actions: JSON.stringify(encryptedActions),
                        filePath,
                        name: value.name,
                        preparationId,
                    },
                    s3: {
                        contentType: PDF_TYPE.type,
                        file: await encryptPdfFile(value.file, userKey),
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
