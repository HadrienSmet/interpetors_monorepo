import { TypedElement } from "../../common";

export enum REFERENCE_TYPES {
    NOTE = "note",
    VOCABULARY = "vocabulary",
}

export type NoteElement = {
    readonly height: number;
    readonly id: string;
    readonly width: number;
    readonly x: number;
    readonly y: number;
};
export type VocabularyElement = {
    readonly height: number;
    readonly id: string;
    readonly width: number;
    readonly x: number;
    readonly y: number;
};
export type NoteReferenceElement = TypedElement<REFERENCE_TYPES.NOTE, NoteElement>;
export type VocabularyReferenceElement = TypedElement<REFERENCE_TYPES.VOCABULARY, VocabularyElement>;

export type ReferenceElement =
    | NoteReferenceElement
    | VocabularyReferenceElement;
