import { PropsWithChildren, useState } from "react";

import { ClientFolderStructure, ClientPdfFile } from "@repo/types";

import { browseStructureToActionOnFile, FileVisitor, getTargetKeys, isClientPdfFile } from "./foldersManager.utils";
import { FileData, FoldersManagerContext, FoldersManagerContextType } from "./FoldersManagerContext";

export const FoldersManagerProvider = ({ children }: PropsWithChildren) => {
    const [foldersStructures, setFoldersStructures] = useState<Array<ClientFolderStructure>>([]);
    const [selectedFile, setSelectedFile] = useState<FileData>({ fileInStructure: null, path: "" });

    // ---------- Files methods ----------
    const changeFileDirectory = (fileName: string, targetFullPath: string) => {
        const moveFile = (structure: ClientFolderStructure): [ClientFolderStructure, ClientPdfFile | null] => {
            const result: ClientFolderStructure = {};
            let fileToMove: ClientPdfFile | null = null;

            for (const [key, value] of Object.entries(structure)) {
                if (isClientPdfFile(value) && key === fileName) {
                    fileToMove = value;
                    continue; // Remove it
                } else if (isClientPdfFile(value)) {
                    result[key] = value;
                } else {
                    const [newSubStructure, moved] = moveFile(value);
                    result[key] = newSubStructure;

                    if (moved) fileToMove = moved;
                }
            }

            return ([result, fileToMove]);
        };

        const insertFile = (structure: ClientFolderStructure, pathParts: Array<string>, fileInStructure: ClientPdfFile): void => {
            const [head, ...rest] = pathParts;

            if (!head) return;

            if (!(head in structure)) {
                structure[head] = {};
            }

            if (rest.length === 0) {
                (structure[head] as ClientFolderStructure)[fileInStructure.file.name] = fileInStructure;
            } else {
                insertFile(structure[head] as ClientFolderStructure, rest, fileInStructure);
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
    const deleteFile = (target: ClientPdfFile) => {
        const visitor: FileVisitor = (key, value) => {
            if (value === target) return (null);

            return ([key, value]);
        };

        setFoldersStructures(state => state.map(s => browseStructureToActionOnFile(s, visitor)));
    };
    const renameFile = (target: ClientPdfFile, newName: string) => {
        const visitor: FileVisitor = (key, value) => {
            if (value === target) {
                const updatedFile = new File([value.file], newName, {
                    type: value.file.type,
                    lastModified: value.file.lastModified
                });

                return ([newName, { ...value, file: updatedFile }]);
            }

            return ([key, value]);
        };

        setFoldersStructures(state => state.map(s => browseStructureToActionOnFile(s, visitor)));
    };
    const updateFile = (file: ClientPdfFile) => {
        const visitor: FileVisitor = (key, value) => {
            if (value.name !== file.name) {
                return ([key, value]);
            }

            const updatedFile = new File(
                [file.file],
                file.name,
                { type: file.file.type }
            );

            return ([
                key,
                {
                    ...file,
                    file: updatedFile
                },
            ]);
        };

        setSelectedFile(state => ({ ...state, fileInStructure: file }));
        setFoldersStructures(state => state.map(folderStructure => browseStructureToActionOnFile(folderStructure, visitor)));
    };

    // ---------- Folders methods ----------
    const changeFolderDirectory = (sourcePath: string, destinatationPath: string) => {
        const sourceParts = getTargetKeys(sourcePath);
        const destinationParts = getTargetKeys(destinatationPath);

        const moveFolder = (structure: ClientFolderStructure): [ClientFolderStructure, ClientFolderStructure | null] => {
            const result: ClientFolderStructure = {};
            let folderToMove: ClientFolderStructure | null = null;

            for (const [key, value] of Object.entries(structure)) {
                if (!isClientPdfFile(value)) {
                    if (sourceParts[0] === key) {
                        if (sourceParts.length === 1) {
                            // This is the folder we want to remove.
                            folderToMove = value;
                            // skip from result
                            continue;
                        }

                        sourceParts.shift();
                    }

                    const [newSubStructure, moved] = moveFolder(value);
                    result[key] = newSubStructure;

                    if (moved) {
                        folderToMove = moved;
                    };
                } else {
                    result[key] = value;
                }
            }

            return ([result, folderToMove]);
        };
        const insertFolder = (structure: ClientFolderStructure, parts: string[], folder: ClientFolderStructure): void => {
            const [head, ...rest] = parts;

            if (!head) return;

            if (!(head in structure)) {
                structure[head] = {};
            }

            if (rest.length === 0) {
                // Insert folder here
                Object.assign((structure[head] as ClientFolderStructure), folder);
            } else {
                insertFolder(structure[head] as ClientFolderStructure, rest, folder);
            }
        };

        setFoldersStructures(state =>
            state.map(structure => {
                const [newStructure, folderToMove] = moveFolder(structure);

                if (!folderToMove) return (newStructure);

                insertFolder(newStructure, destinationParts, {
                    [sourceParts[sourceParts.length - 1]]: folderToMove,
                });

                return (newStructure);
            })
        );
    };
    const createFolder = (folderName: string, targetPath: string) => {
        const pathParts = getTargetKeys(targetPath);

        const create = (structure: ClientFolderStructure, parts: Array<string>): ClientFolderStructure => {
            if (parts.length === 0) return (structure);

            const [current, ...rest] = parts;
            const result: ClientFolderStructure = {};

            for (const [key, value] of Object.entries(structure)) {
                if (key === current) {
                    if (rest.length === 0 && !(value instanceof File)) {
                        result[key] = value;
                        (result[key] as ClientFolderStructure)[folderName] = {};
                    }

                    if (!isClientPdfFile(value)) {
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

        const removeFolder = (structure: ClientFolderStructure, parts: Array<string>): ClientFolderStructure => {
            if (parts.length === 0) return (structure);

            const [current, ...rest] = parts;
            const result: ClientFolderStructure = {};

            for (const [key, value] of Object.entries(structure)) {
                if (key === current) {
                    if (rest.length === 0 && !(value instanceof File)) {
                        // Skip it = delete
                        continue;
                    }

                    if (!isClientPdfFile(value)) {
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

        const changeName = (structure: ClientFolderStructure, parts: Array<string>): ClientFolderStructure => {
            if (parts.length === 0) return (structure);

            const [current, ...rest] = parts;
            const result: ClientFolderStructure = {};

            for (const [key, value] of Object.entries(structure)) {
                if (key === current) {
                    if (rest.length === 0 && !(value instanceof File)) {
                        result[newName] = value;
                        continue;
                    }

                    if (!isClientPdfFile(value)) {
                        result[key] = changeName(value, rest);
                    } else {
                        result[key] = value;
                    }
                } else {
                    result[key] = value;
                }
            }

            return (result);
        };

        setFoldersStructures(state => state.map(str => changeName(str, pathParts)));
    };

    const onDrop = (folder: ClientFolderStructure) => setFoldersStructures(state => [...state, folder]);

    const value: FoldersManagerContextType = {
        files: {
            changeDirectory: changeFileDirectory,
            delete: deleteFile,
            rename: renameFile,
            update: updateFile,
        },
        folders: {
            changeDirectory: changeFolderDirectory,
            create: createFolder,
            delete: deleteFolder,
            onDrop,
            rename: renameFolder,
        },
        foldersStructures,
        selectedFile,
        setSelectedFile,
    };

    return (
        <FoldersManagerContext.Provider value={value}>
            {children}
        </FoldersManagerContext.Provider>
    );
};
