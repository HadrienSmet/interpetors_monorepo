import { FilesActionsStore, FolderStructure, VocabularyTerm } from "@repo/types";

import { FILES } from "@/modules/files";
import { isPdfMetadata } from "@/modules/folders";
import { PDF_TYPE } from "@/modules/pdf";

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
export const prepareJobs = (
    folders: Array<FolderStructure>,
    foldersActions: FilesActionsStore,
    preparationId: string,
    vocabularyTerms: Array<VocabularyTerm> = []
): Array<FlatJob> => {
    const jobs: Array<FlatJob> = [];

    const queue: Queue[] = folders.map(node => ({ path: FIRST_LEVEL_PATH, node }));

    while (queue.length) {
        const { path, node } = queue.shift()!;

        for (const [name, value] of Object.entries(node)) {
            if (isPdfMetadata(value)) {
                const fullPath = path ? `${path}/${value.name}` : `/${value.name}`;
                const filePath = path;

                const terms = vocabularyTerms.filter(t => {
                    const occFilePath = t.occurrence.filePath;
                    const tPath = occFilePath[0] === "/"
                        ? occFilePath
                        // Happens on file at root
                        : `/${occFilePath}`;

                    return (tPath === fullPath);
                });
                const actions = foldersActions[value.id];
                jobs.push({
                    pdf: {
                        actions: JSON.stringify(actions),
                        filePath,
                        name: value.name,
                        preparationId,
                    },
                    s3: {
                        contentType: PDF_TYPE.type,
                        file: value.file,
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
