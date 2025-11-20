import { ActionColor, SavedVocabularyTerm } from "@repo/types";

// Voc item can only belong to one color
export type WordToAdd = {
    readonly color: ActionColor;
    readonly filePath: string;
    readonly pdfFileId?: string;
    readonly pageIndex: number;
    readonly text: string;
};
export type GroupedVocabulary = {
    readonly colorToUse: ActionColor;
    readonly terms: Array<SavedVocabularyTerm>;
};
export type PreparationVocabulary = Array<GroupedVocabulary>;
