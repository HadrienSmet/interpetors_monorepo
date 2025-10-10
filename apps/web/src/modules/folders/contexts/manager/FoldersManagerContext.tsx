import { createContext, Dispatch, SetStateAction, useContext } from "react";

import { FolderStructure, PdfFile } from "@repo/types";

import { getContextError } from "@/contexts/utils";

export type FileData = {
    readonly fileInStructure: PdfFile | null;
    readonly path: string;
};
export type FoldersManagerContextType = {
    readonly files: {
        readonly changeDirectory: (fileName: string, targetPath: string) => void;
        readonly delete: (file: PdfFile) => void;
        readonly rename: (file: PdfFile, newName: string) => void;
        readonly update: (file: PdfFile) => void;
    };
    readonly folders: {
        readonly changeDirectory: (source: string, destination: string) => void;
        readonly create: (name: string, destination: string) => void;
        readonly delete: (destination: string) => void;
        readonly onDrop: (folder: FolderStructure) => void;
        readonly rename: (targetPath: string, newName: string) => void;
    };
    readonly foldersStructure: Array<FolderStructure>;
    readonly selectedFile: FileData;
    readonly setSelectedFile: Dispatch<SetStateAction<FileData>>;
};

export const FoldersManagerContext = createContext<FoldersManagerContextType | null>(null);

export const useFoldersManager = () => {
    const context = useContext(FoldersManagerContext);

    if (!context)
        throw new Error(getContextError("useFoldersManager", "FoldersManagerProvider"));

    return (context);
};
