import { ActionColor, VocabularyTerm } from "@repo/types";

// Voc item can only belong to one color
export type WordToAdd = {
    readonly color: ActionColor;
    readonly filePath: string;
    readonly pageIndex: number;
    readonly text: string;
};
export type GroupedVocabulary = {
    readonly colorToUse: ActionColor;
    readonly terms: Array<VocabularyTerm>;
};
export type PreparationVocabulary = Array<GroupedVocabulary>;
