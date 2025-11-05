import { createContext, Dispatch, SetStateAction, useContext } from "react";

import { FolderStructure, PdfFile } from "@repo/types";

import { getContextError } from "@/contexts/utils";

import { FileData } from "../../types";

export type NewFoldersManagerContextType = {
    readonly isEditable: boolean;
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
    readonly setIsEditable: Dispatch<SetStateAction<boolean>>;
    readonly setSelectedFile: Dispatch<SetStateAction<FileData>>;
    readonly setFoldersStructure: Dispatch<SetStateAction<Array<FolderStructure>>>;
};

export const NewFoldersManagerContext = createContext<NewFoldersManagerContextType | null>(null);

export const useFoldersManager = () => {
    const context = useContext(NewFoldersManagerContext);

    if (!context)
        throw new Error(getContextError("useFoldersManager", "FoldersManagerProvider"));

    return (context);
};
