import { TypedElement } from "../../common";
import { Note } from "../../notes";
import { VocabularyTerm } from "../../vocabulary";

export enum GENERATED_RESOURCES {
    NOTE = "generate_note",
    VOCABULARY = "generate_vocabulary",
}

export type GenerateNoteAction = TypedElement<GENERATED_RESOURCES.NOTE, Note>;
export type GenerateVocabularyAction = TypedElement<GENERATED_RESOURCES.VOCABULARY, VocabularyTerm>;
export type GenerateResourceHistoryAction =
    | GenerateNoteAction
    | GenerateVocabularyAction;
export type GeneratedResourceFileAction = GenerateNoteAction;
