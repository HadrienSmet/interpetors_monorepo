// Voc item can only belong to one color
export type VocabularyInPreparation = {
    readonly color: string;
    readonly id: string;
    readonly filePath: string;
    readonly text: string;
    /** Key = language, Value = translation */
    readonly translations: Record<string, string>;
};
export type WordToAdd = {
    readonly text: string;
    readonly color: string;
    readonly filePath: string;
};
/**
 * @description Color indexed then id indexed
 * @example { "rgb-255-2-20": { "arabiatta": VocabularyItem } } */
export type PreparationVocabulary = Record<string, Record<string, VocabularyInPreparation>>;
