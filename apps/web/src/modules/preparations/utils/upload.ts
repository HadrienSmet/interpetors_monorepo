import { FolderStructure, VocabularyOccurence, VocabularyTerm } from "@repo/types";

import { FILE_ACTION } from "@/modules/fileActions";
import { FILES } from "@/modules/files";
import { FOLDERS, isPdfFile } from "@/modules/folders";
import { VOCABULARY } from "@/modules/vocabulary";

type FolderJob = {
    // identifiant temporaire déterministe, on prend le chemin complet "A/B/C"
    readonly tempId: string;
    readonly name: string;
    // parentTempId = chemin du parent ("A/B"), undefined pour racine
    readonly parentTempId?: string;
};
type TempPostBulkTerm =
    & Omit<VOCABULARY.PostBulkTerm, "occurence">
    & { readonly occurence: VocabularyOccurence };
type FileJobRecord = {
    readonly filesActions: Array<Omit<FILE_ACTION.PostFileActionParams, "fileId">>;
    readonly parentTempId: string | undefined;
    readonly pdf: Omit<FILES.PostPdfParams, "folderId">;
    readonly s3: FILES.UploadParams;
    readonly terms: Array<TempPostBulkTerm>;
};
type ResolvedFileJobRecord = {
    readonly filesActions: Array<Omit<FILE_ACTION.PostFileActionParams, "fileId">>;
    readonly folderId: string;
    readonly pdf: FILES.PostPdfParams;
    readonly s3: FILES.UploadParams;
    readonly terms: Array<TempPostBulkTerm>;
};

// Un niveau de parallélisation
type FolderBatch = FolderJob[];
type QueueItem = {
    readonly path: string;
    readonly node: FolderStructure;
};

type FlattentStructureResult = {
    readonly foldersBatches: Array<FolderBatch>;
    readonly fileJobsRecord: Array<FileJobRecord>;
};
const flattenFolderStructureToBatches = (fs: FolderStructure, terms: Array<VocabularyTerm>): FlattentStructureResult => {
    const fileJobsRecord: Array<FileJobRecord> = [];
    const foldersBatches: Array<FolderBatch> = [];
    const queue: Array<QueueItem> = [{ path: '', node: fs }];

    while (queue.length) {
        const nextLevel: Array<QueueItem> = [];
        const currentBatch: FolderBatch = [];

        for (const { path, node } of queue) {
            for (const [name, value] of Object.entries(node)) {
                if (isPdfFile(value)) {
                    const fullPath = `${path}/${value.name}`;
                    const copy = [...terms];

                    const currentTerms = copy.filter(term => term.occurence.filePath === fullPath);
                    const fileJobRecord: FileJobRecord = {
                        parentTempId: path || undefined,
                        s3: {
                            contentType: "application/pdf",
                            file: value.file,
                            fileName: value.name,
                        },
                        pdf: {
                            filePath: path,
                            name: value.name,
                        },
                        filesActions: Object.keys(value.actions).map(index => {
                            const pageIndex = Number(index);
                            const fileAction = value.actions[pageIndex];

                            return ({
                                pageIndex,
                                ...fileAction,
                            });
                        }),
                        terms: currentTerms,
                    };

                    fileJobsRecord.push(fileJobRecord);
                    // prepare file batch
                    continue;
                }

                const childPath = path ? `${path}/${name}` : name;
                currentBatch.push({
                    tempId: childPath,
                    name,
                    parentTempId: path || undefined,
                });

                nextLevel.push({ path: childPath, node: value as FolderStructure });
            }
        }

        if (currentBatch.length) {
            foldersBatches.push(currentBatch);
        }

        queue.length = 0;
        queue.push(...nextLevel);
    }

    return ({
        fileJobsRecord,
        foldersBatches,
    });
};

const createAllFoldersFromBatches = async (
    batches: FolderBatch[],
    workspaceId: string,
    preparationId: string,
) => {
    // tempId -> realId
    const idByTemp = new Map<string, string>();

    for (const batch of batches) {
        // construire les payloads avec le parentId réel si parentTempId existe
        const payloads = batch.map(({ name, parentTempId }) => ({
            name,
            parentId: parentTempId ? idByTemp.get(parentTempId) : undefined,
        }));

        // Sécurité: s’il manque un parentId attendu, on le détecte tôt (mauvaise structure)
        payloads.forEach((p, i) => {
            if (batch[i].parentTempId && !p.parentId) {
                throw new Error(`Missing parent id for tempId="${batch[i].tempId}" (parent="${batch[i].parentTempId}")`);
            }
        });

        // Lancer toutes les créations du niveau en parallèle
        const results = await Promise.all(
            payloads.map((payload) => FOLDERS.create({
                ...payload,
                preparationId,
                workspaceId,
            })),
        );

        // Mapper tempId -> real id
        results.forEach((res, i) => {
            if (res.success) {
                idByTemp.set(batch[i].tempId, res.data.id);
            }
        });
    }

    return (idByTemp); // si besoin, tu récupères l’id réel de chaque dossier via son chemin
};

const resolveFileJobs = (
    fileJobsRecord: Array<FileJobRecord>,
    idByTemp: Map<string, string>,
    opts?: { rootFolderId?: string; } // si tu veux autoriser des fichiers "à la racine"
): ResolvedFileJobRecord[] => {
    const output: Array<ResolvedFileJobRecord> = [];

    for (const job of fileJobsRecord) {
        const { s3, pdf: jobPdf, filesActions, terms } = job;

        // parentTempId undefined => fichier à la racine de la structure
        if (!job.parentTempId) {
            const rootId = opts?.rootFolderId;
            if (!rootId) {
                // Ton schéma impose PdfFile[] sur Folder, donc il nous faut un folder parent
                throw new Error(
                    `A rootFolderId is required to upload a file at the structure root: "${job.s3.fileName}"`
                );
            }


            const pdf: FILES.PostPdfParams = {
                ...jobPdf,
                folderId: rootId,
            };

            output.push({
                s3,
                pdf,
                filesActions,
                folderId: rootId,
                terms,
            });

            continue;
        }

        const folderId = idByTemp.get(job.parentTempId);
        if (!folderId) {
            throw new Error(
                `Could not resolve parent folder for "${s3.fileName}" (parentTempId="${job.parentTempId}")`
            );
        }

        const pdf: FILES.PostPdfParams = {
            ...jobPdf,
            folderId,
        };

        output.push({
            s3,
            pdf,
            filesActions,
            folderId,
            terms,
        });
    }

    return (output);
};

const handleFileJob = async (fileJob: ResolvedFileJobRecord, workspaceId: string, preparationId: string) => {
    const s3Res = await FILES.upload(fileJob.s3);
    if (!s3Res.success) {
        throw new Error(`An error occured while storing file in S3 bucket. [ERROR]: ${s3Res.message}`);
    }

    const pdfRes = await FILES.postPdf({
        ...fileJob.pdf,
        filePath: s3Res.data.url,
    });
    if (!pdfRes.success) {
        throw new Error(`An error occured while storing the file in database. [ERROR]; ${pdfRes.message}`);
    }

    const { id: fileId } = pdfRes.data;

    const fileActionsResponses = await Promise.all(
        fileJob.filesActions.map(fileAction => FILE_ACTION.post({
            ...fileAction,
            fileId,
        }))
    );

    if (fileJob.terms.length === 0) {
        return;
    }

    const termsResponse = await VOCABULARY.postBulk({
        terms: fileJob.terms.map(term => ({
            ...term,
            occurence: {
                ...term.occurence,
                pdfFileId: fileId,
            }
        })),
        preparationId,
        workspaceId,
    });

    console.log(fileActionsResponses, termsResponse);
};
type UploadPreparationParams = {
    readonly folders: Array<FolderStructure>;
    readonly preparationId: string;
    readonly rootFolderId?: string;
    readonly vocabularyTerms: Array<VocabularyTerm>;
    readonly workspaceId: string;
};
export const uploadPreparation = async ({ folders, preparationId, rootFolderId, vocabularyTerms, workspaceId }: UploadPreparationParams) => {
    for (const folder of folders) {
        const { fileJobsRecord, foldersBatches } = flattenFolderStructureToBatches(folder, vocabularyTerms);

        const idByTemp = await createAllFoldersFromBatches(foldersBatches, workspaceId, preparationId);

        const resolved = resolveFileJobs(fileJobsRecord, idByTemp, { rootFolderId });

        await Promise.all(resolved.map(fileJob => handleFileJob(fileJob, workspaceId, preparationId)));
    }
};
