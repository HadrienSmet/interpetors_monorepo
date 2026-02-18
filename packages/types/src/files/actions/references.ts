import { TypedElement } from "../../common";
import { SerializableRect } from "../../serializable";

import { REFERENCE_TYPES } from "../references";

import { ActionElementBase } from "./common";

type ReferenceActionElement =
    & ActionElementBase
    & {
        readonly rectsArray: Array<SerializableRect>;
        readonly id: string;
    };
export type NoteAction = TypedElement<REFERENCE_TYPES.NOTE, ReferenceActionElement>;
export type VocabularyAction = TypedElement<REFERENCE_TYPES.VOCABULARY, ReferenceActionElement>;
export type ReferenceAction =
    | NoteAction
    | VocabularyAction;
