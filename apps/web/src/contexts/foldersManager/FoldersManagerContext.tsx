import { createContext, useContext } from "react";

import { getContextError } from "../utils";

export type FolderStructure = {
    [key: string]: File | FolderStructure;
};
export type FoldersManagerContextType = {
    readonly files: {
        readonly changeDirectory: (fileName: string, targetPath: string) => void;
        readonly delete: (file: File) => void;
        readonly rename: (file: File, name: string) => void;
    };
    readonly folders: {
        readonly changeDirectory: (source: string, destination: string) => void;
        readonly create: (name: string, destination: string) => void;
        readonly delete: (destination: string) => void;
        readonly onDrop: (folder: FolderStructure) => void;
        readonly rename: (targetPath: string, newName: string) => void;
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
