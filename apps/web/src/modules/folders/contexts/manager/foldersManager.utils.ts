import { FileInStructure, FolderStructure } from "./foldersManager.types";

export const isFileInStructure = (value: FileInStructure | FolderStructure): value is FileInStructure => {
    return (
        typeof value === "object" &&
        value !== null &&
        "file" in value &&
        "name" in value &&
        typeof value.name === "string" &&
        value.file instanceof File &&
        Array.isArray(value.canvasElements) &&
        Array.isArray(value.pdfElements) &&
        Array.isArray(value.references)
    );
};
export type FileVisitor = (key: string, value: FileInStructure, path: Array<string>) => [string, FileInStructure] | null;
/**
 * @description Browse a folder structure to perform an action on a file
 * @returns FolderStructure
 */
export const browseStructureToActionOnFile = (
    structure: FolderStructure,
    visitor: FileVisitor,
    path: Array<string> = []
): FolderStructure => {
    const result: FolderStructure = {};

    for (const [key, value] of Object.entries(structure)) {
        const currentPath = [...path, key];

        if (isFileInStructure(value)) {
            const update = visitor(key, value, currentPath);

            if (update) {
                const [newKey, newValue] = update;

                result[newKey] = newValue;
            }
        } else {
            const newSub = browseStructureToActionOnFile(value, visitor, currentPath);

            result[key] = newSub;
        }
    }

    return (result);
};

export const getFileInStructure = (structure: FolderStructure, targetPath: string, browsedPath?: string): FileInStructure | null => {
    const originPath = browsedPath ?? "";
    for (const [key, value] of Object.entries(structure)) {
        const currentPath = `${originPath}/${key}`;

        if (isFileInStructure(value)) {
            if (targetPath === currentPath) {
                return (value);
            }
        } else {
            const result = getFileInStructure(value, targetPath, currentPath);

            if (result) return (result);
        }
    }

    return (null);
};
export const getTargetKeys = (targetPath: string) => targetPath.split("/").filter(Boolean);
