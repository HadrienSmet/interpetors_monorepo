import { Note } from "../../notes";
import { VocabularyTerm } from "../../vocabulary";

import { TypedElement } from "../dev";

export enum GENERATED_ELEMENTS {
    NOTE = "generate_note",
    VOCABULARY = "generate_vocabulary",
}
type TextOccurence = {
    readonly filePath: string;
    readonly text: string;
};
export type FileReference = {
    readonly color: string;
    readonly id: string;
    readonly occurence: TextOccurence;
};
export type GenerateNoteAction = TypedElement<GENERATED_ELEMENTS.NOTE, Note>;
export type GenerateVocabularyAction = TypedElement<GENERATED_ELEMENTS.VOCABULARY, VocabularyTerm & { readonly color: string; }>;
export type GenerateResourceAction =
    | GenerateNoteAction
    | GenerateVocabularyAction;
