import { createContext, useContext } from "react";

import { FileAction, FilesActionsStore } from "@repo/types";

import { getContextError } from "@/contexts/utils";

export type FoldersActionsContextValue = {
    readonly foldersActions: FilesActionsStore;
    readonly getFileActions: (fileId: string) => Record<number, FileAction>;
    readonly getPageActions: (fileId: string, pageIndex: number) => FileAction;
    readonly updatePageActions: (fileId: string, pageIndex: number, newAction: FileAction) => void;
};
export const FoldersActionsContext = createContext<FoldersActionsContextValue | null>(null);
export const useFoldersActions = () => {
    const ctx = useContext(FoldersActionsContext);

    if (!ctx) throw new Error(getContextError("useFoldersActions", "FoldersActionsProvider"));

    return (ctx);
};
