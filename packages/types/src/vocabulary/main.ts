export type VocabularyOccurence = {
    readonly filePath: string;
    readonly pageIndex: number;
    readonly text: string;
};
export type VocabularyTerm = {
    readonly id: string;
    readonly occurence: VocabularyOccurence;
    readonly translations: Array<string>;
};
export type VocabularyWithColor =
    & VocabularyTerm
    & { readonly color: string; };
