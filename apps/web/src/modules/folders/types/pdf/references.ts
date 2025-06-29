export enum GENRATED_ELEMENTS {
    NOTE = "generate_note",
    VOCABULARY = "generate_vocabulary",
}
type TextOccurence = {
    readonly filePath: string;
    readonly pageIndex: number;
    readonly text: string;
};
type PdfGeneratedElement = {
    readonly color: string;
    readonly id: string;
    readonly occurence: TextOccurence;
};
export type PdfNote =
    & PdfGeneratedElement
    & {
        readonly note: string;
        readonly y: number;
    };

export type PdfVocabulary =
    & PdfGeneratedElement
    & { readonly translations: Record<string, string>; };

export type GenerateNoteAction = {
    readonly element: PdfNote;
    readonly type: GENRATED_ELEMENTS.NOTE;
};
export type GenerateVocabularyAction = {
    readonly element: PdfVocabulary;
    readonly type: GENRATED_ELEMENTS.VOCABULARY;
};

export type GenerateElementAction =
    | GenerateNoteAction
    | GenerateVocabularyAction;
