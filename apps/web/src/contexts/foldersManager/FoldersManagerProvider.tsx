import { PropsWithChildren, useState } from "react";

import { FoldersManagerContext, FoldersManagerContextType, FolderStructure } from "./FoldersManagerContext";

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

            return [result, fileToMove];
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

        setFoldersStructures(state => {
            return state.map(structure => {
                const [newStructure, fileToMove] = moveFile(structure);

                if (!fileToMove) return newStructure; // If the file wasn't found in this structure

                const pathParts = targetFullPath.split("/").filter(Boolean); // Ex: "folderA/folderB"
                insertFile(newStructure, pathParts, fileToMove);

                return newStructure;
            });
        });
    };
    const changeFileName = (file: File, newName: string) => {
        // TODO: refacto
        const updateStructure = (structure: FolderStructure): FolderStructure => {
            const result: FolderStructure = {};

            for (const [key, value] of Object.entries(structure)) {
                if (value instanceof File && value === file) {
                    const updated = new File(
                        [value],
                        newName,
                        { type: value.type, lastModified: value.lastModified }
                    );

                    result[newName] = updated;
                } else if (value instanceof File) {
                    result[key] = value;
                } else {
                    result[key] = updateStructure(value);
                }
            }

            return (result);
        };

        // TODO: improve time complexity
        setFoldersStructures(state => state.map(updateStructure));
    };
    const deleteFile = (file: File) => {
        // TODO: refacto
        const updateStructure = (structure: FolderStructure): FolderStructure => {
            const result: FolderStructure = {};

            for (const [key, value] of Object.entries(structure)) {
                if (value instanceof File && value === file) {
                    continue;
                } else if (value instanceof File) {
                    result[key] = value;
                } else {
                    result[key] = updateStructure(value);
                }
            }

            return (result);
        };

        // TODO: improve time complexity
        setFoldersStructures(state => state.map(updateStructure));
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
