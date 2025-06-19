import { NoteAction, NoteReferenceElement, REFERENCE_TYPES } from "../../../../types";

export const convertNoteAction = (noteAction: NoteAction): Array<NoteReferenceElement> | null => {
    const { element } = noteAction;
    const { rectsArray, pageIndex, pageDimensions, noteId } = element;

    if (!rectsArray.length) return null;


    return (rectsArray.map(targetRect => ({
        type: REFERENCE_TYPES.NOTE,
        element: {
            height: targetRect.height,
            noteId,
            pageIndex,
            x: targetRect.left - pageDimensions.left,
            y: targetRect.top - pageDimensions.top,
            width: targetRect.width,
        },
    })));
};
