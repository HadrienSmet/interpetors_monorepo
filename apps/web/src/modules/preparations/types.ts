import { FilesActionsStore, FolderStructure, SavedVocabularyTerm } from "@repo/types";

import { GroupedVocabulary } from "../vocabulary";

export type PreparationItem = {
    readonly createdAt: string;
    readonly id: string;
    readonly title: string;
    readonly updatedAt: string;
};

export type SavedPreparation =
    & PreparationItem
    & {
        readonly folders: Array<FolderStructure>;
        readonly foldersActions: FilesActionsStore;
        readonly vocabulary: Array<SavedVocabularyTerm>;
    };
export type ClientPreparation = {
    readonly folders: Array<FolderStructure>;
    readonly id: string;
    readonly title: string;
    readonly vocabulary: Array<GroupedVocabulary>;
};
