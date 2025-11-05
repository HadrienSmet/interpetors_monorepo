import { PropsWithChildren, useState } from "react";

import { FolderStructure } from "@repo/types";

import { FileData } from "../../types";

import { FoldersDisplayerContext, FoldersDisplayerContextValue } from "./FoldersDisplayerContext";

export const FoldersDisplayerProvider = ({ children }: PropsWithChildren) => {
    const [foldersStructure, setFoldersStructure] = useState<Array<FolderStructure>>([]);
    const [selectedFile, setSelectedFile] = useState<FileData>({ fileInStructure: null, path: "" });

    const value: FoldersDisplayerContextValue = {
        foldersStructure,
        selectedFile,
        setFoldersStructure,
        setSelectedFile,
    };

    return (
        <FoldersDisplayerContext.Provider value={value}>
            {children}
        </FoldersDisplayerContext.Provider>
    );
};
