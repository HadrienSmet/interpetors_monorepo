import {
	FilesActionsStore,
	FolderStructure,
	PdfFile,
	PdfMetadata,
} from "@repo/types";

import { FILES } from "@/modules/files";

import { isPdfMetadata } from "../contexts";

export type NewFile = {
	readonly filePath: string;
	readonly pdfFile: PdfFile;
};
type FileToPatchInDelta =
	& FILES.FileToPatch
	& {
		actions?: string;
		language?: string;
	};

export type Delta = {
	readonly filesToPatch: Array<FileToPatchInDelta>;
	readonly newFiles: Array<NewFile>;
};
type DiffFoldersItem = {
	readonly actions: FilesActionsStore;
	readonly folders: Array<FolderStructure>;
};

/** Clé "identité" du fichier. On privilégie la référence File, sinon fallback (name|size|lastModified). */
const makeFileKey = (pdf: PdfMetadata): string => {
	const file = pdf.file as any;

	// Cas idéal : référence stable injectée sur l'objet File
	const refId = file.__refId ?? undefined;
	if (refId) return (`ref:${refId}`);

	// Encore mieux si ton PdfMetadata/PdfFile a déjà un id stable
	if (pdf.id) return (`pdf:${pdf.id}`);

	// Fallback stable au renommage
	const size = file.size ?? "unk";
	const lastModified = file.lastModified ?? "unk";
	return (`sig:${size}|${lastModified}`);
};

type ActionMeta = {
	elementsLen: number;
	referencesLen: number;
	resourcesLen: number;
};
type Indexed = {
	byKey: Map<string, { path: string; pdf: PdfFile; pages: Map<number, ActionMeta> }>;
	pathByKey: Map<string, string>;
};
/** Aplati un FolderStructure[] en map: fileKey -> infos (chemin, pdf, métadonnées d'actions) */
const indexStructures = (item: DiffFoldersItem) => {
	const output: Indexed = {
		byKey: new Map(),
		pathByKey: new Map(),
	};

	const walk = (node: FolderStructure, base: string) => {
		for (const [name, value] of Object.entries(node)) {
			const currentPath = base ? `${base}/${name}` : `/${name}`;

			if (isPdfMetadata(value)) {
				const key = makeFileKey(value);
				const pages = new Map<number, ActionMeta>();
				const fileActions = item.actions[value.id] ?? {};

				for (const [k, action] of Object.entries(fileActions)) {
					const idx = Number(k);
					const elementsLen = action?.elements?.length ?? 0;
					const referencesLen = action?.references?.length ?? 0;
					const resourcesLen = action?.generatedResources?.length ?? 0;

					pages.set(idx, {
						elementsLen,
						referencesLen,
						resourcesLen,
					});
				}

				output.byKey.set(key, {
					path: currentPath,
					pdf: { ...value, actions: fileActions },
					pages,
				});
				output.pathByKey.set(key, currentPath);
			} else {
				walk(value, currentPath);
			}
		}
	};

	for (const root of item.folders) walk(root, "");
	return (output);
};
const shouldPatchLanguage = (oldPdf: PdfFile, newPdf: PdfFile): boolean => {
	const oldLanguage = oldPdf.language;
	const newLanguage = newPdf.language;

	// On ne patch que l’attribution initiale d’une langue
	return (
		(oldLanguage === undefined || oldLanguage === null) &&
		typeof newLanguage === "string" &&
		newLanguage.trim().length > 0
	);
};

const getParentPath = (fullPath: string): string => {
	const parts = fullPath.split("/");
	parts.pop();

	return (parts.join("/") || "/");
};

type DiffFoldersParams = {
	readonly before: DiffFoldersItem;
	readonly after: DiffFoldersItem;
};
/** Calcule le delta */
export const diffFolderStructures = ({
	before,
	after,
}: DiffFoldersParams): Delta => {
	const oldIdx = indexStructures(before);
	const newIdx = indexStructures(after);

	const newFiles: Delta["newFiles"] = [];
	const filesToPatch: Delta["filesToPatch"] = [];

	for (const [key, { path: newPath, pdf: newPdf, pages: newPages }] of newIdx.byKey.entries()) {
		let hasToPatchFile = false;
		const fileToPatch: FileToPatchInDelta = { id: newPdf.id };
		const oldPath = oldIdx.pathByKey.get(key);
		const oldEntry = oldIdx.byKey.get(key);

		const newParentPath = getParentPath(newPath);
		const oldParentPath = oldPath ? getParentPath(oldPath) : undefined;

		if (!oldPath || !oldEntry) {
			newFiles.push({ filePath: newParentPath, pdfFile: newPdf });
			continue;
		}

		// Déplacement du fichier
		if (oldParentPath !== newParentPath) {
			hasToPatchFile = true;
			fileToPatch.filePath = newParentPath;
		}

		// Renommage du fichier
		// Le plus fiable ici est de comparer le nom métier
		if (oldEntry.pdf.name !== newPdf.name) {
			hasToPatchFile = true;
			fileToPatch.name = newPdf.name;
		}

		// Nouveau : on patch si la langue vient d’être définie
		if (shouldPatchLanguage(oldEntry.pdf, newPdf)) {
			hasToPatchFile = true;
			fileToPatch.language = newPdf.language;
		}

		// Comparaison page par page
		for (const [pageIndex] of newPages.entries()) {
			const oldMeta = oldEntry.pages.get(pageIndex);
			const actionNew = newPdf.actions[pageIndex];
			const actionOld = oldEntry.pdf.actions[pageIndex];

			if (!actionNew) continue;

			if (!oldMeta) {
				hasToPatchFile = true;
				fileToPatch.actions = JSON.stringify(newPdf.actions);
				break;
			}

			const elemsNewLen = actionNew.elements?.length ?? 0;
			if (elemsNewLen > oldMeta.elementsLen) {
				const slice = actionNew.elements.slice(oldMeta.elementsLen);
				if (slice.length) {
					hasToPatchFile = true;
					fileToPatch.actions = JSON.stringify(newPdf.actions);
					break;
				}
			}

			const refsNewLen = actionNew.references?.length ?? 0;
			if (refsNewLen > oldMeta.referencesLen) {
				const slice = actionNew.references!.slice(oldMeta.referencesLen);
				if (slice.length) {
					hasToPatchFile = true;
					fileToPatch.actions = JSON.stringify(newPdf.actions);
					break;
				}
			}

			const newResources = actionNew.generatedResources ?? [];
			const oldResources = actionOld?.generatedResources ?? [];
			const resourcesNewLength = newResources.length;

			if (resourcesNewLength > oldMeta.resourcesLen) {
				const slice = newResources.slice(oldMeta.resourcesLen);
				if (slice.length) {
					hasToPatchFile = true;
					fileToPatch.actions = JSON.stringify(newPdf.actions);
					break;
				}
			}

			for (let i = 0; i < resourcesNewLength; i++) {
				const newResource = newResources[i];
				const oldResource = oldResources[i];

				if (newResource.note !== oldResource.note) {
					hasToPatchFile = true;
					fileToPatch.actions = JSON.stringify(newPdf.actions);
					break;
				}
			}

			if (hasToPatchFile && fileToPatch.actions) {
				break;
			}
		}

		if (hasToPatchFile) {
			filesToPatch.push(fileToPatch);
		}
	}

	return ({ newFiles, filesToPatch });
};
