import { createContext, Dispatch, SetStateAction, useContext } from "react";

import { FolderStructure } from "@repo/types";

import { getContextError } from "@/contexts/utils";
import { FileData } from "../../types";

export type FoldersDisplayerContextValue = {
    readonly foldersStructure: Array<FolderStructure>;
    readonly selectedFile: FileData;
    readonly setFoldersStructure: Dispatch<SetStateAction<Array<FolderStructure>>>;
    readonly setSelectedFile: Dispatch<SetStateAction<FileData>>;
};

export const FoldersDisplayerContext = createContext<FoldersDisplayerContextValue | null>(null);

export const useFoldersDisplayer = () => {
    const context = useContext(FoldersDisplayerContext);

    if (!context)
        throw new Error(getContextError("useFoldersDisplayer", "FoldersDisplayerProvider"));

    return (context);
};
