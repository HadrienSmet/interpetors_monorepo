import { REFERENCE_TYPES, ReferenceAction } from "../../../types";

import { convertNoteAction } from "./converters";

export const getReferenceElement = (action: ReferenceAction) => {
    switch(action.type) {
        case REFERENCE_TYPES.NOTE:
            return (convertNoteAction(action));
    }
};
