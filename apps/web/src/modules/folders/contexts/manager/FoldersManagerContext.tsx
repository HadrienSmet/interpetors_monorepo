import { createContext, Dispatch, SetStateAction, useContext } from "react";

import { getContextError } from "@/contexts/utils";

import { FileInStructure, FolderStructure } from "../../types";

export type FileData = {
    readonly fileInStructure: FileInStructure | null;
    readonly path: string;
};
export type FoldersManagerContextType = {
    readonly files: {
        readonly changeDirectory: (fileName: string, targetPath: string) => void;
        readonly delete: (file: FileInStructure) => void;
        readonly rename: (file: FileInStructure, newName: string) => void;
        readonly update: (file: FileInStructure) => void;
    };
    readonly folders: {
        readonly changeDirectory: (source: string, destination: string) => void;
        readonly create: (name: string, destination: string) => void;
        readonly delete: (destination: string) => void;
        readonly onDrop: (folder: FolderStructure) => void;
        readonly rename: (targetPath: string, newName: string) => void;
    };
    readonly foldersStructures: Array<FolderStructure>;
    readonly selectedFile: FileData;
    readonly setSelectedFile: Dispatch<SetStateAction<FileData>>
};

export const FoldersManagerContext = createContext<FoldersManagerContextType | null>(null)

export const useFoldersManager = () => {
    const context = useContext(FoldersManagerContext);

    if (!context)
        throw new Error(getContextError("useFoldersManager", "FoldersManagerProvider"));

    return (context);
};
