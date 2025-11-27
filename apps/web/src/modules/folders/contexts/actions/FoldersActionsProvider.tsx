import { PropsWithChildren, useEffect, useState } from "react";

import { FilesActionsStore } from "@repo/types";

import { FIRST_PAGE } from "@/modules/files/utils";

import { FoldersActionsContext, FoldersActionsContextValue } from "./FoldersActionsContext";

const EMPTY_PAGE_ACTIONS = { elements: [], references: [], generatedResources: [] } as const;
const EMPTY_FILE_ACTIONS = { [FIRST_PAGE]: EMPTY_PAGE_ACTIONS } as const;

type FoldersActionsProviderProps =
    & { readonly savedActions?: FilesActionsStore; }
    & PropsWithChildren;
export const FoldersActionsProvider = ({ children, savedActions }: FoldersActionsProviderProps) => {
    const [foldersActions, setFoldersActions] = useState<FilesActionsStore>({});

    const getFileActions: FoldersActionsContextValue["getFileActions"] = (fileId) => (foldersActions[fileId] ?? EMPTY_FILE_ACTIONS);
    const getPageActions: FoldersActionsContextValue["getPageActions"] = (fileId, pageIndex) => (foldersActions[fileId][pageIndex] ?? EMPTY_PAGE_ACTIONS);
    const updatePageActions: FoldersActionsContextValue["updatePageActions"] = (fileId, pageIndex, newAction) => (
        setFoldersActions(state => ({
            ...state,
            [fileId]: {
                ...state[fileId],
                [pageIndex]: newAction,
            },
        }))
    );

    useEffect(() => {
        if (savedActions) {
            setFoldersActions(savedActions);
        }
    }, [savedActions]);

    const value = {
        foldersActions,
        getFileActions,
        getPageActions,
        savedActions: savedActions ?? {},
        updatePageActions,
    };

    return (
        <FoldersActionsContext.Provider value={value}>
            {children}
        </FoldersActionsContext.Provider>
    );
};
