import { PropsWithChildren, useState } from "react";

import { FoldersManagerContext, FoldersManagerContextType, FolderStructure } from "./FoldersManagerContext";

type Visitor = (key: string, value: File, path: string[]) => [string, File] | null;
/**
 * @description Browse a folder structure to perform an action on a file
 * @returns FolderStructure
 */
const browseStructure = (
    structure: FolderStructure,
    visitor: Visitor,
    path: string[] = []
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
            const newSub = browseStructure(value, visitor, currentPath);
            if (Object.keys(newSub).length > 0) {
                result[key] = newSub;
            }
        }
    }

    return (result);
};

export const FoldersManagerProvider = (props: PropsWithChildren) => {
    const [foldersStructures, setFoldersStructures] = useState<Array<FolderStructure>>([]);

    // ---------- Files methods ----------
    const changeFileDirectory = (fileName: string, targetFullPath: string) => {
        // TODO: refacto
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

        const insertFile = (structure: FolderStructure, pathParts: string[], file: File): void => {
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

                const pathParts = targetFullPath.split("/").filter(Boolean); // Retrieving the path tp the new location
                insertFile(newStructure, pathParts, fileToMove);

                return (newStructure);
            })
        ));
    };
    const changeFileName = (target: File, newName: string) => {
        const visitor: Visitor = (key, value) => {
            if (value === target) {
                const updated = new File([value], newName, {
                    type: value.type,
                    lastModified: value.lastModified
                });

                return ([newName, updated]);
            }

            return ([key, value]);
        };

        setFoldersStructures(state => state.map(s => browseStructure(s, visitor)));
    };
    const deleteFile = (target: File) => {
        const visitor: Visitor = (key, value) => {
            if (value === target) return (null);

            return ([key, value]);
        };

        setFoldersStructures(state => state.map(s => browseStructure(s, visitor)));
    };

    // ---------- Folders methods ----------

    const onDrop = (folder: FolderStructure) => setFoldersStructures(state => [...state, folder]);

    const value: FoldersManagerContextType = {
        files: {
            changeDirectory: changeFileDirectory,
            changeName: changeFileName,
            delete: deleteFile,
        },
        folders: {
            changeDirectory: () => null,
            changeName: () => null,
            create: () => null,
            delete: () => null,
            onDrop,
        },
        foldersStructures,
    };

    return (
        <FoldersManagerContext value={value}>
            {props.children}
        </FoldersManagerContext>
    );
};
