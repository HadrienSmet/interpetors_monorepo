import { createContext, useContext } from "react";

import { getContextError } from "../utils";

import {
    FileInStructure,
    FileInteractions,
    FolderStructure,
} from "./foldersManager.types";

export type UpdateFileParams =
    & {
        readonly newFile: FileInStructure;
        readonly old: FileInStructure;
    }
    & FileInteractions;
export type FoldersManagerContextType = {
    readonly files: {
        readonly changeDirectory: (fileName: string, targetPath: string) => void;
        readonly delete: (file: FileInStructure) => void;
        readonly rename: (file: FileInStructure, name: string) => void;
        readonly update: (params: UpdateFileParams) => void;
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
