import { NoteAction, NoteReferenceElement, REFERENCE_TYPES } from "@repo/types";

export const convertNoteAction = (noteAction: NoteAction): Array<NoteReferenceElement> => {
    const { element } = noteAction;
    const { rectsArray, pageDimensions, id } = element;

    if (!rectsArray.length) return ([]);


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
