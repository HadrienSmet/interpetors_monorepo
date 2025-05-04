import { PropsWithChildren, useState } from "react";

import { FoldersManagerContext, FoldersManagerContextType, FolderStructure } from "./FoldersManagerContext";

type FileVisitor = (key: string, value: File, path: Array<string>) => [string, File] | null;

/**
 * @description Browse a folder structure to perform an action on a file
 * @returns FolderStructure
 */
const browseStructureToActionOnFile = (
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
const getTargetKeys = (targetPath: string) => targetPath.split("/").filter(Boolean);

export const FoldersManagerProvider = (props: PropsWithChildren) => {
    const [foldersStructures, setFoldersStructures] = useState<Array<FolderStructure>>([]);

    // ---------- Files methods ----------
    const changeFileDirectory = (fileName: string, targetFullPath: string) => {
        const moveFile = (structure: FolderStructure): [FolderStructure, File | null] => {
            const result: FolderStructure = {};
            let fileToMove: File | null = null;

            for (const [key, value] of Object.entries(structure)) {
                if (value instanceof File && key === fileName) {
                    fileToMove = value;
                    continue; // Remove it
                } else if (value instanceof File) {
                    result[key] = value;
                } else {
                    const [newSubStructure, moved] = moveFile(value);
                    result[key] = newSubStructure;

                    if (moved) fileToMove = moved;
                }
            }

            return ([result, fileToMove]);
        };

        const insertFile = (structure: FolderStructure, pathParts: Array<string>, file: File): void => {
            const [head, ...rest] = pathParts;

            if (!head) return;

            if (!(head in structure)) {
                structure[head] = {};
            }

            if (rest.length === 0) {
                (structure[head] as FolderStructure)[file.name] = file;
            } else {
                insertFile(structure[head] as FolderStructure, rest, file);
            }
        };

        setFoldersStructures(state => (
            state.map(structure => {
                const [newStructure, fileToMove] = moveFile(structure);

                if (!fileToMove) return (newStructure); // File not found in this structure

                const pathParts = getTargetKeys(targetFullPath); // Retrieving the path tp the new location
                insertFile(newStructure, pathParts, fileToMove);

                return (newStructure);
            })
        ));
    };
    const renameFile = (target: File, newName: string) => {
        const visitor: FileVisitor = (key, value) => {
            if (value === target) {
                const updated = new File([value], newName, {
                    type: value.type,
                    lastModified: value.lastModified
                });

                return ([newName, updated]);
            }

            return ([key, value]);
        };

        setFoldersStructures(state => state.map(s => browseStructureToActionOnFile(s, visitor)));
    };
    const deleteFile = (target: File) => {
        const visitor: FileVisitor = (key, value) => {
            if (value === target) return (null);

            return ([key, value]);
        };

        setFoldersStructures(state => state.map(s => browseStructureToActionOnFile(s, visitor)));
    };

    // ---------- Folders methods ----------
    const createFolder = (folderName: string, targetPath: string) => {
        const pathParts = getTargetKeys(targetPath);

        const create = (structure: FolderStructure, parts: Array<string>): FolderStructure => {
            if (parts.length === 0) return (structure);

            const [current, ...rest] = parts;
            const result: FolderStructure = {};

            for (const [key, value] of Object.entries(structure)) {
                if (key === current) {
                    if (rest.length === 0 && !(value instanceof File)) {
                        result[key] = value;
                        (result[key] as FolderStructure)[folderName] = {};
                    }

                    if (!(value instanceof File)) {
                        result[key] = create(value, rest);
                    } else {
                        result[key] = value;
                    }
                } else {
                    result[key] = value;
                }
            }

            return (result);
        };

        setFoldersStructures(state => state.map(str => create(str, pathParts)));
    };
    const deleteFolder = (targetPath: string) => {
        const pathParts = getTargetKeys(targetPath);

        const removeFolder = (structure: FolderStructure, parts: Array<string>): FolderStructure => {
            if (parts.length === 0) return (structure);

            const [current, ...rest] = parts;
            const result: FolderStructure = {};

            for (const [key, value] of Object.entries(structure)) {
                if (key === current) {
                    // Si on est au bon niveau et que c’est un dossier à supprimer
                    if (rest.length === 0 && !(value instanceof File)) {
                        // Skip it = delete
                        continue;
                    }

                    // Sinon, on continue à descendre
                    if (!(value instanceof File)) {
                        result[key] = removeFolder(value, rest);
                    } else {
                        result[key] = value;
                    }
                } else {
                    result[key] = value;
                }
            }

            return (result);
        };

        setFoldersStructures(state => state.map(str => removeFolder(str, pathParts)));
    };
    const renameFolder = (targetPath: string, newName: string) => {
        const pathParts = getTargetKeys(targetPath);

        const changeName = (structure: FolderStructure, parts: Array<string>): FolderStructure => {
            if (parts.length === 0) return (structure);

            const [current, ...rest] = parts;
            const result: FolderStructure = {};

            for (const [key, value] of Object.entries(structure)) {
                if (key === current) {
                    if (rest.length === 0 && !(value instanceof File)) {
                        result[newName] = value;
                        continue;
                    }

                    if (!(value instanceof File)) {
                        result[key] = changeName(value, rest);
                    } else {
                        result[key] = value;
                    }
                } else {
                    result[key] = value;
                }
            }

            return (result);
        }

        setFoldersStructures(state => state.map(str => changeName(str, pathParts)));
    };

    const onDrop = (folder: FolderStructure) => setFoldersStructures(state => [...state, folder]);

    const value: FoldersManagerContextType = {
        files: {
            changeDirectory: changeFileDirectory,
            delete: deleteFile,
            rename: renameFile,
        },
        folders: {
            changeDirectory: () => null,
            create: createFolder,
            delete: deleteFolder,
            onDrop,
            rename: renameFolder,
        },
        foldersStructures,
    };

    return (
        <FoldersManagerContext value={value}>
            {props.children}
        </FoldersManagerContext>
    );
};
