import { ElementAction, FolderStructure, Note, PdfFile, ReferenceElement } from "@repo/types";

import { isPdfFile } from "../contexts";

type FilePath = string;

type NewActions = {
    readonly elements: ElementAction[];
    readonly fileId: string;
    readonly generatedResources?: Note[];
    readonly pageIndex: number;
    readonly references?: ReferenceElement[];
};
type PatchActions = {
    readonly elements?: ElementAction[];
    readonly fileId: string;
    readonly pageIndex: number;
    readonly references?: ReferenceElement[];
    readonly generatedResources?: Note[];
};
type NewFile = {
    readonly filePath: FilePath;
    readonly pdfFile: PdfFile;
};
type MovedFile = {
    readonly filePath: string;
    readonly id: string;
};
export type Delta = {
    readonly movedFiles: Array<MovedFile>;
    readonly newActions: Array<NewActions>;
    readonly newFiles: Array<NewFile>;
    readonly patchActions: Array<PatchActions>;
};

// ---------- Implémentation ----------

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
        pathByKey: Map<string, string>; // pratique pour moves
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
    const movedFiles: Delta["movedFiles"] = [];
    const newActions: Delta["newActions"] = [];
    const patchActions: Delta["patchActions"] = [];

    // 1) Détecter nouveaux fichiers + fichiers déplacés
    for (const [key, { path: newPath, pdf }] of newIdx.byKey.entries()) {
        const oldPath = oldIdx.pathByKey.get(key);
        const splitted = newPath.split("/");
        splitted.pop();
        const pathWithoutName = splitted.join("/");

        if (!oldPath) {
            newFiles.push({ filePath: pathWithoutName, pdfFile: pdf });
        } else if (oldPath !== newPath) {
            movedFiles.push({ filePath: pathWithoutName, id: pdf.id });
        }
    }

    // 2) Détecter nouvelles actions
    for (const [key, { pdf: newPdf, pages: newPages }] of newIdx.byKey.entries()) {
        const oldEntry = oldIdx.byKey.get(key);

        // Si c’est un nouveau fichier, toutes ses pages sont “nouvelles” → on reporte tout
        if (!oldEntry) {
            for (const [pageIndex, _meta] of newPages.entries()) {
                const action = newPdf.actions[pageIndex];
                if (!action) continue;
                if (
                    (action.elements?.length ?? 0) > 0 ||
                    (action.references?.length ?? 0) > 0 ||
                    (action.generatedResources?.length ?? 0) > 0
                ) {
                    newActions.push({
                        fileId: newPdf.id,
                        pageIndex,
                        elements: action.elements ?? [],
                        references: action.references ?? [],
                        generatedResources: (action.generatedResources as Note[] | undefined) ?? [],
                    });
                }
            }
            continue;
        }

        // Sinon, comparer page par page (append only)
        for (const [pageIndex, _] of newPages.entries()) {
            const oldMeta = oldEntry.pages.get(pageIndex);
            const actionNew = newPdf.actions[pageIndex];

            if (!actionNew) continue;

            if (!oldMeta) {
                // page nouvelle -> tout le contenu est “nouveau”
                newActions.push({
                    fileId: newPdf.id,
                    pageIndex,
                    elements: actionNew.elements ?? [],
                    references: actionNew.references ?? [],
                    generatedResources: (actionNew.generatedResources as Note[] | undefined) ?? [],
                });
                continue;
            }

            // éléments ajoutés
            const elemsNewLen = actionNew.elements?.length ?? 0;
            if (elemsNewLen > oldMeta.elementsLen) {
                const slice = actionNew.elements!.slice(oldMeta.elementsLen);
                if (slice.length) {
                    patchActions.push({
                        fileId: newPdf.id,
                        pageIndex,
                        elements: slice,
                    });
                }
            }

            // références ajoutées
            const refsNewLen = actionNew.references?.length ?? 0;
            if (refsNewLen > oldMeta.referencesLen) {
                const slice = actionNew.references!.slice(oldMeta.referencesLen);
                if (slice.length) {
                    patchActions.push({
                        fileId: newPdf.id,
                        pageIndex,
                        references: slice,
                    });
                }
            }

            // ressources (notes) ajoutées
            const resNewLen = actionNew.generatedResources?.length ?? 0;
            if (resNewLen > oldMeta.resourcesLen) {
                const slice = actionNew.generatedResources!.slice(oldMeta.resourcesLen) as Note[];
                if (slice.length) {
                    patchActions.push({
                        fileId: newPdf.id,
                        pageIndex,
                        generatedResources: slice,
                    });
                }
            }
        }
    }

    return ({ newFiles, movedFiles, newActions, patchActions });
};
