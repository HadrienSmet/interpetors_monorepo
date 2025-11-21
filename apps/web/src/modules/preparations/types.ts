import { SavedFolderStructure, SavedVocabularyTerm } from "@repo/types";

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
        readonly folders: Array<SavedFolderStructure>;
        readonly vocabulary: Array<SavedVocabularyTerm>;
    };
export type ClientPreparation = {
    readonly folders: Array<SavedFolderStructure>;
    readonly id: string;
    readonly title: string;
    readonly vocabulary: Array<GroupedVocabulary>;
};
