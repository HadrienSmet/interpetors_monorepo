import { FolderStructure, Note, PdfFile } from "@repo/types";

import { isPdfFile } from "../contexts";

type NewFile = {
    readonly filePath: string;
    readonly pdfFile: PdfFile;
};
type FileToPatch = {
    actions?: string;
    filePath?: string;
    readonly id: string;
};
export type Delta = {
    readonly filesToPatch: Array<FileToPatch>;
    readonly newFiles: Array<NewFile>;
};


/** Clé "identité" du fichier. On privilégie la référence File, sinon fallback (name|size|lastModified). */
const makeFileKey = (pdf: PdfFile): string => {
    const f = pdf.file;
    const refId = (f as any).__refId ?? undefined;
    if (refId) return (`ref:${refId}`);

    const size = (f as any).size ?? "unk";
    const lm = (f as any).lastModified ?? "unk";
    return (`sig:${pdf.name}|${size}|${lm}`);
};

/** Aplati un FolderStructure[] en map: fileKey -> infos (chemin, pdf, métadonnées d'actions) */
const indexStructures = (structures: Array<FolderStructure>) => {
    type ActionMeta = {
        elementsLen: number;
        referencesLen: number;
        resourcesLen: number;
    };
    type Indexed = {
        byKey: Map<string, { path: string; pdf: PdfFile; pages: Map<number, ActionMeta>; }>;
        pathByKey: Map<string, string>; // Usefull for moves
    };

    const output: Indexed = {
        byKey: new Map(),
        pathByKey: new Map(),
    };

    const walk = (node: FolderStructure, base: string) => {
        for (const [name, value] of Object.entries(node)) {
            const currentPath = base ? `${base}/${name}` : `/${name}`;
            if (isPdfFile(value)) {
                const key = makeFileKey(value);
                const pages = new Map<number, ActionMeta>();
                for (const [k, action] of Object.entries(value.actions)) {
                    const idx = Number(k);
                    const elementsLen = action?.elements?.length ?? 0;
                    const referencesLen = action?.references?.length ?? 0;
                    const resourcesLen = action?.generatedResources?.length ?? 0;
                    pages.set(idx, { elementsLen, referencesLen, resourcesLen });
                }
                output.byKey.set(key, { path: currentPath, pdf: value, pages });
                output.pathByKey.set(key, currentPath);
            } else {
                walk(value as FolderStructure, currentPath);
            }
        }
    };

    for (const root of structures) walk(root, "");
    return (output);
};

/** Calcule le delta */
export const diffFolderStructures = (
    before: Array<FolderStructure>,
    after: Array<FolderStructure>
): Delta => {
    const oldIdx = indexStructures(before);
    const newIdx = indexStructures(after);

    const newFiles: Delta["newFiles"] = [];
    const filesToPatch: Delta["filesToPatch"] = [];

    // 2) Détecter nouvelles actions
    for (const [key, { path: newPath, pdf: newPdf, pages: newPages }] of newIdx.byKey.entries()) {
        let hasToPatchFile = false;
        let fileToPatch: FileToPatch = {
            id: newPdf.id,
        };
        const oldPath = oldIdx.pathByKey.get(key);
        const oldEntry = oldIdx.byKey.get(key);
        const splitted = newPath.split("/");
        splitted.pop();
        const pathWithoutName = splitted.join("/");

        if (!oldPath || !oldEntry) {
            newFiles.push({ filePath: pathWithoutName, pdfFile: newPdf });
            continue;
        } else if (oldPath !== newPath) {
            hasToPatchFile = true;
            fileToPatch.filePath = pathWithoutName;
        }

        // Sinon, comparer page par page (append only)
        for (const [pageIndex, _] of newPages.entries()) {
            const oldMeta = oldEntry.pages.get(pageIndex);
            const actionNew = newPdf.actions[pageIndex];

            if (!actionNew) continue;

            if (!oldMeta) {
                // page nouvelle -> tout le contenu est “nouveau”
                hasToPatchFile = true;
                fileToPatch.actions = JSON.stringify(newPdf.actions);
                break;
            }

            // éléments ajoutés
            const elemsNewLen = actionNew.elements?.length ?? 0;
            if (elemsNewLen > oldMeta.elementsLen) {
                const slice = actionNew.elements!.slice(oldMeta.elementsLen);
                if (slice.length) {
                    hasToPatchFile = true;
                    fileToPatch.actions = JSON.stringify(newPdf.actions);
                    break;
                }
            }

            // références ajoutées
            const refsNewLen = actionNew.references?.length ?? 0;
            if (refsNewLen > oldMeta.referencesLen) {
                const slice = actionNew.references!.slice(oldMeta.referencesLen);
                if (slice.length) {
                    hasToPatchFile = true;
                    fileToPatch.actions = JSON.stringify(newPdf.actions);
                    break;
                }
            }

            // ressources (notes) ajoutées
            const resNewLen = actionNew.generatedResources?.length ?? 0;
            if (resNewLen > oldMeta.resourcesLen) {
                const slice = actionNew.generatedResources!.slice(oldMeta.resourcesLen) as Note[];
                if (slice.length) {
                    hasToPatchFile = true;
                    fileToPatch.actions = JSON.stringify(newPdf.actions);
                    break;
                }
            }
        }

        if (hasToPatchFile) {
            filesToPatch.push(fileToPatch);
        }
    }

    return ({ newFiles, filesToPatch });
};
