import { PdfVocabulary } from "@/modules/folders";

// Voc item can only belong to one color
export type WordToAdd = {
    readonly color: string;
    readonly filePath: string;
    readonly pageIndex: number;
    readonly text: string;
};
/**
 * @description Color indexed then id indexed
 * @example { "rgb-255-2-20": { "arabiatta": VocabularyItem } } */
export type PreparationVocabulary = Record<string, Record<string, PdfVocabulary>>;
