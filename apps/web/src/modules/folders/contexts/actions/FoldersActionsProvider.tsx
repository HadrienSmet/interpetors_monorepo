import { PropsWithChildren, useEffect, useState } from "react";

import { FilesActionsStore } from "@repo/types";

import { FIRST_PAGE } from "@/modules/files/utils";
import { usePreparations } from "@/modules/preparations";

import { FoldersActionsContext, FoldersActionsContextValue } from "./FoldersActionsContext";

const EMPTY_PAGE_ACTIONS = { elements: [], references: [], generatedResources: [] } as const;
const EMPTY_FILE_ACTIONS = { [FIRST_PAGE]: EMPTY_PAGE_ACTIONS } as const;

export const FoldersActionsProvider = ({ children }: PropsWithChildren) => {
    const [foldersActions, setFoldersActions] = useState<FilesActionsStore>({});

	const { selectedPreparation } = usePreparations();

    const getFileActions: FoldersActionsContextValue["getFileActions"] = (fileId) => (foldersActions[fileId] ?? EMPTY_FILE_ACTIONS);
    const getPageActions: FoldersActionsContextValue["getPageActions"] = (fileId, pageIndex) => (foldersActions[fileId]?.[pageIndex] ?? EMPTY_PAGE_ACTIONS);
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
        if (selectedPreparation) {
            setFoldersActions(selectedPreparation.foldersActions);
        }
    }, [selectedPreparation]);

    const value = {
        foldersActions,
        getFileActions,
        getPageActions,
        updatePageActions,
    };

    return (
        <FoldersActionsContext.Provider value={value}>
            {children}
        </FoldersActionsContext.Provider>
    );
};
