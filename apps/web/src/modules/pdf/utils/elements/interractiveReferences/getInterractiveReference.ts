import { REFERENCE_TYPES, ReferenceAction, ReferenceElement } from "@repo/types";

import { convertNoteAction, convertVocabularyAction } from "./converters";

export const getInterractiveReference = (action: ReferenceAction): Array<ReferenceElement> => {
    switch(action.type) {
        case REFERENCE_TYPES.NOTE:
            return (convertNoteAction(action));
        case REFERENCE_TYPES.VOCABULARY:
            return (convertVocabularyAction(action));
    }
};
