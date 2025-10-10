import { TypedElement } from "../../common";

export enum REFERENCE_TYPES {
    NOTE = "note",
    VOCABULARY = "vocabulary",
}

export type ReferencingText = {
    readonly height: number;
    readonly id: string;
    readonly width: number;
    readonly x: number;
    readonly y: number;
};
export type NoteReferenceElement = TypedElement<REFERENCE_TYPES.NOTE, ReferencingText>;
export type VocabularyReferenceElement = TypedElement<REFERENCE_TYPES.VOCABULARY, ReferencingText>;

export type ReferenceElement =
    | NoteReferenceElement
    | VocabularyReferenceElement;
