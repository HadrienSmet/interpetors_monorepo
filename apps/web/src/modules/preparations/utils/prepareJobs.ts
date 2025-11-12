import { FolderStructure, VocabularyOccurence, VocabularyTerm } from "@repo/types";

import { FILE_ACTION } from "@/modules/fileActions";
import { FILES } from "@/modules/files";
import { VOCABULARY } from "@/modules/vocabulary";
import { isPdfFile } from "@/modules/folders";

type PdfFileJob = Omit<FILES.PostPdfParams, "s3Key">;
type TempPostBulkTerm =
    & Omit<VOCABULARY.PostBulkTerm, "occurrence">
    & { readonly occurrence: VocabularyOccurence };
type FlatJob = {
    pdf: PdfFileJob;
    s3: FILES.UploadParams;
    filesActions: Array<Omit<FILE_ACTION.PostFileActionParams, "fileId">>;
    terms: Array<TempPostBulkTerm>;
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
    preparationId: string,
    vocabularyTerms: Array<VocabularyTerm> = []
): Array<FlatJob> => {
    const jobs: Array<FlatJob> = [];

    const queue: Queue[] = folders.map(node => ({ path: FIRST_LEVEL_PATH, node }));

    while (queue.length) {
        const { path, node } = queue.shift()!;

        for (const [name, value] of Object.entries(node)) {
            if (isPdfFile(value)) {
                const fullPath = path ? `${path}/${value.name}` : `/${value.name}`;
                const filePath = path;

                const terms = vocabularyTerms.filter(t => t.occurrence.filePath === fullPath);

                const filesActions: Array<Omit<FILE_ACTION.PostFileActionParams, "fileId">> = Object.keys(value.actions).map(pageKey => {
                    const pageIndex = Number(pageKey);
                    const fileActions = value.actions[pageIndex];

                    return ({
                        pageIndex,
                        elements: fileActions.elements ?? [],
                        references: fileActions.references ?? [],
                        generatedResources: fileActions.generatedResources ?? [],
                    });
                });

                jobs.push({
                    pdf: {
                        filePath,
                        name: value.name,
                        preparationId,
                    },
                    s3: {
                        contentType: "application/pdf",
                        file: value.file,
                        fileName: value.name,
                    },
                    filesActions,
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
