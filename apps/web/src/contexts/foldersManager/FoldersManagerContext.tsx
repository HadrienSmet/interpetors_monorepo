import { createContext, useContext } from "react";

import { getContextError } from "../utils";

export type FolderStructure = {
    [key: string]: File | FolderStructure;
};
export type FoldersManagerContextType = {
    readonly files: {
        readonly changeDirectory: (fileName: string, targetPath: string) => void;
        readonly changeName: (file: File, name: string) => void;
        readonly delete: (file: File) => void;
    };
    readonly folders: {
        readonly changeDirectory: (folder: FolderStructure, destination: string) => void;
        readonly changeName: (folder: FolderStructure, name: string) => void;
        readonly create: (name: string, destination: string) => void;
        readonly delete: (folder: FolderStructure, destination: string) => void;
        readonly onDrop: (folder: FolderStructure) => void;
    };
    readonly foldersStructures: Array<FolderStructure>;
};

export const FoldersManagerContext = createContext<FoldersManagerContextType | null>(null);

export const useFoldersManager = () => {
    const context = useContext(FoldersManagerContext);

    if (!context)
        throw new Error(getContextError("useFoldersManager", "FoldersManagerProvider"));

    return (context);
};
