import { SavedFolderStructure, VocabularyTerm } from "@repo/types";

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
        readonly vocabulary: Array<VocabularyTerm>;
    };
