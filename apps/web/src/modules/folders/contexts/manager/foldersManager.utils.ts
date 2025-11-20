import { FolderStructure, PdfFile } from "@repo/types";

import { FileData } from "../../types";

export const isPdfFile = (value: PdfFile | FolderStructure): value is PdfFile => {
    return (
        typeof value === "object" &&
        value !== null &&
        "file" in value &&
        "name" in value &&
        typeof value.name === "string" &&
        value.file instanceof File &&
        typeof value.actions === "object"
    );
};

export type FileVisitor = (key: string, value: PdfFile, path: Array<string>) => [string, PdfFile] | null;
/**
 * @description Browse a folder structure to perform an action on a file
 * @returns ClientFolderStructure
 */
export const browseStructureToActionOnFile = (
    structure: FolderStructure,
    visitor: FileVisitor,
    path: Array<string> = []
): FolderStructure => {
    const result: FolderStructure = {};

    for (const [key, value] of Object.entries(structure)) {
        const currentPath = [...path, key];

        if (isPdfFile(value)) {
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
export const getPdfFile = (structure: FolderStructure, targetPath: string, browsedPath?: string): PdfFile | null => {
    const originPath = browsedPath ?? "";
    for (const [key, value] of Object.entries(structure)) {
        const currentPath = `${originPath}/${key}`;

        if (isPdfFile(value)) {
            if (targetPath === currentPath) return (value);
        } else {
            const result = getPdfFile(value, targetPath, currentPath);

            if (result) return (result);
        }
    }

    return (null);
};
export const getTargetKeys = (targetPath: string) => targetPath.split("/").filter(Boolean);

const searchNode = (
    node: FolderStructure,
    prefix: string,
    target: string
): FileData | null => {
    for (const [key, value] of Object.entries(node)) {
        const currentPath = prefix ? `${prefix}/${key}` : key;

        if (isPdfFile(value)) {
            if (currentPath === target) {
                return ({ fileInStructure: value, path: currentPath });
            }
            continue;
        }

        const sub = searchNode(value, currentPath, target);
        if (sub) return (sub);
    }

    return (null);
};
export const findFile = (nodes: FolderStructure[], target: string): FileData => {
    for (const root of nodes) {
        const result = searchNode(root, "", target);
        if (result) return (result);
    }

    return ({ fileInStructure: null, path: "" });
};
