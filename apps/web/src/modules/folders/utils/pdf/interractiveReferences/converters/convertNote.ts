import { InterractiveNoteAction, NoteReferenceElement, REFERENCE_TYPES } from "../../../../types";

export const convertNoteAction = (noteAction: InterractiveNoteAction): Array<NoteReferenceElement> | null => {
    const { element } = noteAction;
    const { rectsArray, pageIndex, pageDimensions, id } = element;

    console.log({ noteAction })

    if (!rectsArray.length) return (null);


    return (rectsArray.map(targetRect => ({
        type: REFERENCE_TYPES.NOTE,
        element: {
            height: targetRect.height,
            id,
            pageIndex,
            x: targetRect.left - pageDimensions.left,
            y: targetRect.top - pageDimensions.top,
            width: targetRect.width,
        },
    })));
};
