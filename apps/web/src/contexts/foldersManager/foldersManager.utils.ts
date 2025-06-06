import { FileInStructure, FileInteractions, FolderStructure } from "./foldersManager.types";
import { UpdateFileParams } from "./FoldersManagerContext";
import { isFileInStructure } from "./FoldersManagerProvider";

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

type UpdateKeyParams<K extends keyof FileInteractions> = {
    readonly updateParams: UpdateFileParams;
    readonly key: K;
    readonly file: FileInStructure;
};
export const updateKey = <K extends keyof FileInteractions>({ updateParams, key, file }: UpdateKeyParams<K>): FileInStructure[K] => (
    updateParams[key]
        // @ts-expect-error
        ? [
            ...file[key],
            ...updateParams[key],
        ]
        : file[key]
);
export const assignUpdate = <K extends keyof FileInteractions>(
    output: FileInteractions,
    key: K,
    params: UpdateFileParams,
    file: FileInStructure
) => {
    output[key] = updateKey({ updateParams: params, file, key });
};
