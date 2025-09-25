import { REFERENCE_TYPES } from "@repo/types";

import { InterractiveReferenceAction } from "../../../types";

import { convertNoteAction, convertVocabularyAction } from "./converters";

export const getInterractiveReference = (action: InterractiveReferenceAction) => {
    switch(action.type) {
        case REFERENCE_TYPES.NOTE:
            return (convertNoteAction(action));
        case REFERENCE_TYPES.VOCABULARY:
            return (convertVocabularyAction(action));
    }
};
