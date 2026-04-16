import { createContext, Dispatch, SetStateAction, useContext } from "react";

import { FilesActionsStore, FolderStructure, SavedVocabularyTerm } from "@repo/types";

import { getContextError } from "@/contexts/utils";

import { ClientPreparation, SavedPreparation } from "../../types";

export type SavePreparationParams = {
    readonly folders: Array<FolderStructure>;
    readonly foldersActions: FilesActionsStore;
    readonly old?: SavedPreparation;
    readonly rootFolderId?: string;
    readonly title: string;
    readonly vocabularyTerms: Array<SavedVocabularyTerm>;
};
type PreparationContextValue = {
    readonly createPreparation: (params: SavePreparationParams) => Promise<void>;
	readonly isNew: boolean;
    readonly isSaving: boolean;
    readonly patchPreparation: (params: SavePreparationParams) => Promise<void>;
    readonly preparation: Omit<ClientPreparation, "folders">;
    readonly setTitle: Dispatch<SetStateAction<string>>;
};

export const PreparationContext = createContext<PreparationContextValue | null>(null);

export const usePreparation = () => {
    const ctx = useContext(PreparationContext);

    if (!ctx) {
        throw new Error(getContextError("usePreparation", "PreparationProvider"));
    }

    return (ctx);
};
