import { FolderNode } from "@repo/types";

export type PdfFilePlaceholder = {
    readonly actions: Record<number, any>;
    readonly name: string;
    readonly id: string;
    readonly s3Key: string;   // fourni par le backend (filePath)
    readonly file?: File;       // sera ajouté par hydratation
};
export type TempFolderStructure = {
    [key: string]: TempFolderStructure | PdfFilePlaceholder;
};
export type BatchItem = {
    readonly id: string;
    readonly name: string;
    readonly s3Key: string;
};
type BuildFromApiOutput = {
    readonly structure: TempFolderStructure;
    readonly batches: Array<BatchItem>;
};

/**
 * Construit une FolderStructure-like depuis la réponse backend "tree".
 * Chaque fichier est stocké en placeholder (avec fileUrl) jusqu'à hydratation.
 */
export function buildFolderStructureFromApi(
    apiRoots: Array<FolderNode>,
): BuildFromApiOutput {
    const structure: TempFolderStructure = {};
    const batches: Array<BatchItem> = [];

    const insertFolderNode = (
        target: TempFolderStructure,
        node: FolderNode,
    ): void => {
        const folderObj: TempFolderStructure = {};

        // 1) fichiers du dossier courant -> placeholders
        for (const f of node.files ?? []) {
            folderObj[f.name] = {
                id: f.id,
                name: f.name,
                actions: {},       // à remplir si tu charges des actions par page
                s3Key: f.s3Key,
            };
            batches.push({ id: f.id, s3Key: f.s3Key, name: f.name })
        }

        // 2) enfants -> récursif
        for (const child of node.children ?? []) {
            insertFolderNode(folderObj, child);
        }

        // 3) raccrocher ce dossier dans la cible
        target[node.name] = folderObj;
    };

    for (const r of apiRoots) {
        insertFolderNode(structure, r);
    }

    return ({
        batches,
        structure,
    });
}
