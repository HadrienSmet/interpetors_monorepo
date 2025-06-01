import { FolderStructure } from "./FoldersManagerContext";

export type FileVisitor = (key: string, value: File, path: Array<string>) => [string, File] | null;

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

        if (value instanceof File) {
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
export const getFileInStructure = (structure: FolderStructure, targetPath: string, browsedPath?: string): File | null => {
    const originPath = browsedPath ?? "";
    for (const [key, value] of Object.entries(structure)) {
        const currentPath = `${originPath}/${key}`;

        if (value instanceof File) {
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
