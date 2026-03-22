import { ActionColor } from "../colors";

export type VocabularyOccurence = {
    readonly filePath: string;
	readonly language: string;
    readonly pageIndex: number;
    readonly text: string;
};
export type VocabularyTerm = {
    readonly color: ActionColor;
    readonly id: string;
    readonly occurrence: VocabularyOccurence;
    readonly translations: Array<string>;
};
type SavedVocabularyOccurrence =
    & VocabularyOccurence
    & { readonly pdfFileId: string; }
export type SavedVocabularyTerm =
    & Omit<VocabularyTerm, "occurrence">
    & { readonly occurrence: SavedVocabularyOccurrence; };
