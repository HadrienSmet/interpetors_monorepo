import { createContext, Dispatch, SetStateAction, useContext } from "react";

import { ClientFolderStructure, ClientPdfFile } from "@repo/types";

import { getContextError } from "@/contexts/utils";

export type FileData = {
    readonly fileInStructure: ClientPdfFile | null;
    readonly path: string;
};
export type FoldersManagerContextType = {
    readonly files: {
        readonly changeDirectory: (fileName: string, targetPath: string) => void;
        readonly delete: (file: ClientPdfFile) => void;
        readonly rename: (file: ClientPdfFile, newName: string) => void;
        readonly update: (file: ClientPdfFile) => void;
    };
    readonly folders: {
        readonly changeDirectory: (source: string, destination: string) => void;
        readonly create: (name: string, destination: string) => void;
        readonly delete: (destination: string) => void;
        readonly onDrop: (folder: ClientFolderStructure) => void;
        readonly rename: (targetPath: string, newName: string) => void;
    };
    readonly foldersStructures: Array<ClientFolderStructure>;
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
