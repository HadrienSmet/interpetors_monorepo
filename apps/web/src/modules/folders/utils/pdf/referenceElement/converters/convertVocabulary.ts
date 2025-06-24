import { REFERENCE_TYPES, VocabularyAction, VocabularyReferenceElement } from "../../../../types";

export const convertVocabularyAction = (vocAction: VocabularyAction): Array<VocabularyReferenceElement> | null => {
    const { element } = vocAction;
    const { rectsArray, pageIndex, pageDimensions, id } = element;

    if (rectsArray.length < 0) return null;

    return (rectsArray.map(targetRect => ({
        type: REFERENCE_TYPES.VOCABULARY,
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
