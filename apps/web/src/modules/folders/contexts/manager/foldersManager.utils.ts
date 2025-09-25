import { ClientFolderStructure, ClientPdfFile } from "@repo/types";

export const isClientPdfFile = (value: ClientPdfFile | ClientFolderStructure): value is ClientPdfFile => {
    return (
        typeof value === "object" &&
        value !== null &&
        "file" in value &&
        "name" in value &&
        typeof value.name === "string" &&
        value.file instanceof File &&
        typeof value.elements === "object"
    );
};
export type FileVisitor = (key: string, value: ClientPdfFile, path: Array<string>) => [string, ClientPdfFile] | null;
/**
 * @description Browse a folder structure to perform an action on a file
 * @returns ClientFolderStructure
 */
export const browseStructureToActionOnFile = (
    structure: ClientFolderStructure,
    visitor: FileVisitor,
    path: Array<string> = []
): ClientFolderStructure => {
    const result: ClientFolderStructure = {};

    for (const [key, value] of Object.entries(structure)) {
        const currentPath = [...path, key];

        if (isClientPdfFile(value)) {
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

export const getClientPdfFile = (structure: ClientFolderStructure, targetPath: string, browsedPath?: string): ClientPdfFile | null => {
    const originPath = browsedPath ?? "";
    for (const [key, value] of Object.entries(structure)) {
        const currentPath = `${originPath}/${key}`;

        if (isClientPdfFile(value)) {
            if (targetPath === currentPath) {
                return (value);
            }
        } else {
            const result = getClientPdfFile(value, targetPath, currentPath);

            if (result) return (result);
        }
    }

    return (null);
};
export const getTargetKeys = (targetPath: string) => targetPath.split("/").filter(Boolean);
