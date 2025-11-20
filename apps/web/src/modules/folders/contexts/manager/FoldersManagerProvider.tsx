import { PropsWithChildren, useMemo, useState } from "react";

import { FolderStructure, PdfFile } from "@repo/types";

import { FileData } from "../../types";

import { getTargetKeys, isPdfFile, browseStructureToActionOnFile, FileVisitor, findFile } from "./foldersManager.utils";
import { FoldersManagerContext, FoldersManagerContextValue } from "./FoldersManagerContext";

type FoldersManagerProviderProps =
    & { readonly editable?: boolean; }
    & PropsWithChildren;
export const FoldersManagerProvider = ({ children, editable = false }: FoldersManagerProviderProps) => {
    const [foldersStructure, setFoldersStructure] = useState<Array<FolderStructure>>([]);
    const [isEditable, setIsEditable] = useState(editable);
    const [selectedFilePath, setSelectedFilePath] = useState<string | undefined>(undefined);

    // ---------- Files methods ----------
    const EMPTY_PAGE_ACTION = { elements: [] as any[] };

    const addNewPageActions = (path: string, pageIndex: number) => {
        const parts = getTargetKeys(path);
        if (parts.length === 0) return;

        const addAtPath = (structure: FolderStructure, segs: string[]): FolderStructure => {
            const [head, ...rest] = segs;
            if (!head) return (structure);

            const result: FolderStructure = {};

            for (const [key, value] of Object.entries(structure)) {
                if (key !== head) {
                    // autre clé: recopier tel quel
                    result[key] = value;
                    continue;
                }

                // On est sur le segment courant du chemin
                if (rest.length === 0) {
                    // Dernier segment -> devrait être le fichier
                    if (isPdfFile(value)) {
                        const alreadyExists = value.actions[pageIndex] != null;
                        result[key] = alreadyExists
                            ? value // rien à faire
                            : {
                                ...value,
                                actions: {
                                    ...value.actions,
                                    [pageIndex]: EMPTY_PAGE_ACTION,
                                },
                            };
                    } else {
                        // ce n’est pas un fichier: recopier tel quel
                        result[key] = value;
                    }
                } else {
                    // Il reste des segments -> descendre si c'est un dossier
                    if (!isPdfFile(value)) {
                        result[key] = addAtPath(value, rest);
                    } else {
                        // on attendait un dossier mais on a un fichier: recopier
                        result[key] = value;
                    }
                }
            }

            return (result);
        };

        setFoldersStructure((state) => state.map((root) => addAtPath(root, parts)));
    };
    const changeFileDirectory = (fileName: string, targetFullPath: string) => {
        const moveFile = (structure: FolderStructure): [FolderStructure, PdfFile | null] => {
            const result: FolderStructure = {};
            let fileToMove: PdfFile | null = null;

            for (const [key, value] of Object.entries(structure)) {
                if (isPdfFile(value) && key === fileName) {
                    fileToMove = value;
                    continue; // Remove it
                } else if (isPdfFile(value)) {
                    result[key] = value;
                } else {
                    const [newSubStructure, moved] = moveFile(value);
                    result[key] = newSubStructure;

                    if (moved) fileToMove = moved;
                }
            }

            return ([result, fileToMove]);
        };
        const insertFile = (structure: FolderStructure, pathParts: Array<string>, fileInStructure: PdfFile): void => {
            const [head, ...rest] = pathParts;

            if (!head) return;

            if (!(head in structure)) {
                structure[head] = {};
            }

            if (rest.length === 0) {
                (structure[head] as FolderStructure)[fileInStructure.file.name] = fileInStructure;
            } else {
                insertFile(structure[head] as FolderStructure, rest, fileInStructure);
            }
        };

        setFoldersStructure(state => (
            state.map(structure => {
                const [newStructure, fileToMove] = moveFile(structure);

                if (!fileToMove) return (newStructure); // File not found in this structure

                const pathParts = getTargetKeys(targetFullPath); // Retrieving the path tp the new location
                insertFile(newStructure, pathParts, fileToMove);

                return (newStructure);
            })
        ));
    };
    const deleteFile = (target: PdfFile) => {
        const visitor: FileVisitor = (key, value) => {
            if (value === target) return (null);

            return ([key, value]);
        };

        setFoldersStructure(state => state.map(folder => browseStructureToActionOnFile(folder, visitor)));
    };
    const renameFile = (target: PdfFile, newName: string) => {
        const visitor: FileVisitor = (key, value) => {
            if (value === target) {
                const updatedFile = new File([value.file], newName, {
                    type: value.file.type,
                    lastModified: value.file.lastModified,
                });

                return ([newName, { ...value, file: updatedFile }]);
            }

            return ([key, value]);
        };

        setFoldersStructure(state => state.map(folder => browseStructureToActionOnFile(folder, visitor)));
    };
    const updateFile = (file: PdfFile) => {
        const visitor: FileVisitor = (key, value) => {
            if (value.name !== file.name) {
                return ([key, value]);
            }

            const updatedFile = new File(
                [file.file],
                file.name,
                {
                    type: value.file.type,
                    lastModified: value.file.lastModified,
                }
            );

            return ([
                key,
                {
                    ...file,
                    file: updatedFile
                },
            ]);
        };

        setFoldersStructure(state => state.map(folder => browseStructureToActionOnFile(folder, visitor)));
    };

    // ---------- Folders methods ----------
    const changeFolderDirectory = (sourcePath: string, destinatationPath: string) => {
        const sourceParts = getTargetKeys(sourcePath);
        const destinationParts = getTargetKeys(destinatationPath);

        const moveFolder = (structure: FolderStructure): [FolderStructure, FolderStructure | null] => {
            const result: FolderStructure = {};
            let folderToMove: FolderStructure | null = null;

            for (const [key, value] of Object.entries(structure)) {
                if (isPdfFile(value)) {
                    result[key] = value;
                    continue;
                }

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
            }

            return ([result, folderToMove]);
        };
        const insertFolder = (structure: FolderStructure, parts: string[], folder: FolderStructure): void => {
            const [head, ...rest] = parts;

            if (!head) return;

            if (!(head in structure)) {
                structure[head] = {};
            }

            if (rest.length === 0) {
                // Insert folder here
                Object.assign((structure[head] as FolderStructure), folder);
            } else {
                insertFolder(structure[head] as FolderStructure, rest, folder);
            }
        };

        setFoldersStructure(state => state.map(structure => {
            const [newStructure, folderToMove] = moveFolder(structure);

            if (!folderToMove) return (newStructure);

            insertFolder(newStructure, destinationParts, {
                [sourceParts[sourceParts.length - 1]]: folderToMove,
            });

            return (newStructure);
        }));
    };
    const createFolder = (folderName: string, targetPath: string) => {
        const pathParts = getTargetKeys(targetPath);

        const create = (structure: FolderStructure, parts: Array<string>): FolderStructure => {
            if (parts.length === 0) return (structure);

            const [current, ...rest] = parts;
            const result: FolderStructure = {};

            for (const [key, value] of Object.entries(structure)) {
                if (key !== current) {
                    result[key] = value;
                    continue;
                }

                if (rest.length === 0 && !(value instanceof File)) {
                    result[key] = value;
                    (result[key] as FolderStructure)[folderName] = {};
                }

                if (!isPdfFile(value)) {
                    result[key] = create(value, rest);
                    continue;
                }

                result[key] = value;
            }

            return (result);
        };

        setFoldersStructure(state => state.map(str => create(str, pathParts)));
    };
    const deleteFolder = (targetPath: string) => {
        const pathParts = getTargetKeys(targetPath);

        const removeFolder = (structure: FolderStructure, parts: Array<string>): FolderStructure => {
            if (parts.length === 0) return (structure);

            const [current, ...rest] = parts;
            const result: FolderStructure = {};

            for (const [key, value] of Object.entries(structure)) {
                if (key !== current) {
                    result[key] = value;
                    continue;
                }

                if (rest.length === 0 && !(value instanceof File)) {
                    // Skip it = delete
                    continue;
                }

                if (!isPdfFile(value)) {
                    result[key] = removeFolder(value, rest);
                    continue;
                }

                result[key] = value;
            }

            return (result);
        };

        setFoldersStructure(state => state.map(str => removeFolder(str, pathParts)));
    };
    const renameFolder = (targetPath: string, newName: string) => {
        const pathParts = getTargetKeys(targetPath);

        const changeName = (structure: FolderStructure, parts: Array<string>): FolderStructure => {
            if (parts.length === 0) return (structure);

            const [current, ...rest] = parts;
            const result: FolderStructure = {};

            for (const [key, value] of Object.entries(structure)) {
                if (key !== current) {
                    result[key] = value;
                    continue;
                }

                if (rest.length === 0 && !(value instanceof File)) {
                    result[newName] = value;
                    continue;
                }

                if (!isPdfFile(value)) {
                    result[key] = changeName(value, rest);
                    continue;
                }

                result[key] = value;
            }

            return (result);
        };

        setFoldersStructure(state => state.map(str => changeName(str, pathParts)));
    };

    const onDrop = (folder: FolderStructure) => setFoldersStructure(state => [...state, folder]);

    const selectedFile: FileData = useMemo(() => {
        if (!selectedFilePath) {
            return ({ fileInStructure: null, path: "" });
        }

        return (findFile(foldersStructure, selectedFilePath));
    }, [foldersStructure, selectedFilePath]);

    const value: FoldersManagerContextValue = {
        isEditable,
        files: {
            addNewPageActions,
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
        foldersStructure,
        selectedFile,
        setIsEditable,
        setSelectedFilePath,
        setFoldersStructure,
    };

    return (
        <FoldersManagerContext.Provider value={value}>
            {children}
        </FoldersManagerContext.Provider>
    );
};
