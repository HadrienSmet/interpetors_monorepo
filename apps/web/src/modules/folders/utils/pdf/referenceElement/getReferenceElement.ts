import { REFERENCE_TYPES, ReferenceAction } from "../../../types";

import { convertNoteAction, convertVocabularyAction } from "./converters";

export const getReferenceElement = (action: ReferenceAction) => {
    switch(action.type) {
        case REFERENCE_TYPES.NOTE:
            return (convertNoteAction(action));
        case REFERENCE_TYPES.VOCABULARY:
            return (convertVocabularyAction(action));
    }
};
