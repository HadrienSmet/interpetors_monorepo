import { NoteReferenceElement, REFERENCE_TYPES } from "@repo/types";

import { InterractiveNoteAction } from "@/modules/files";

export const convertNoteAction = (noteAction: InterractiveNoteAction): Array<NoteReferenceElement> | null => {
    const { element } = noteAction;
    const { rectsArray, pageDimensions, id } = element;

    if (!rectsArray.length) return (null);


    return (rectsArray.map(targetRect => ({
        type: REFERENCE_TYPES.NOTE,
        element: {
            height: targetRect.height,
            id,
            x: targetRect.left - pageDimensions.left,
            y: targetRect.top - pageDimensions.top,
            width: targetRect.width,
        },
    })));
};
