import { createContext, Dispatch, SetStateAction, useContext } from "react";

import { FolderStructure, PdfMetadata } from "@repo/types";

import { getContextError } from "@/contexts/utils";

import { FileData } from "../../types";

export const LANGUAGES_STATE = {
	MANDATORY: "mandatory",
	NULL: "null",
	OPTIONAL: "optional",
} as const;
export type LanguagesState = typeof LANGUAGES_STATE[keyof typeof LANGUAGES_STATE];
export type FoldersManagerContextValue = {
	readonly files: {
		readonly changeDirectory: (fileName: string, targetPath: string) => void;
        readonly delete: (file: PdfMetadata) => void;
        readonly rename: (file: PdfMetadata, newName: string) => void;
        readonly update: (file: PdfMetadata) => void;
    };
    readonly folders: {
		readonly assignLanguageToFiles: (paths: Array<string>, lng: string) => void;
        readonly changeDirectory: (source: string, destination: string) => void;
        readonly create: (name: string, destination: string) => void;
        readonly delete: (destination: string) => void;
        readonly onDrop: (folder: FolderStructure) => void;
        readonly rename: (targetPath: string, newName: string) => void;
    };
    readonly foldersStructure: Array<FolderStructure>;
	readonly isEditable: boolean;
	readonly languagesState: LanguagesState;
    readonly selectedFile: FileData;
    readonly setIsEditable: Dispatch<SetStateAction<boolean>>;
	readonly setLanguagesState: Dispatch<SetStateAction<LanguagesState>>;
    readonly setSelectedFilePath: Dispatch<SetStateAction<string | undefined>>;
    readonly setFoldersStructure: Dispatch<SetStateAction<Array<FolderStructure>>>;
};

export const FoldersManagerContext = createContext<FoldersManagerContextValue | null>(null);

export const useFoldersManager = () => {
    const context = useContext(FoldersManagerContext);

    if (!context)
        throw new Error(getContextError("useFoldersManager", "FoldersManagerProvider"));

    return (context);
};
