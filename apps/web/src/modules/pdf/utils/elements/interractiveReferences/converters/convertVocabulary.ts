import { VocabularyReferenceElement, REFERENCE_TYPES, VocabularyAction } from "@repo/types";

export const convertVocabularyAction = (vocAction: VocabularyAction): Array<VocabularyReferenceElement> => {
    const { element } = vocAction;
    const { rectsArray, pageDimensions, id } = element;

    if (rectsArray.length < 0) return ([]);

    return (rectsArray.map(targetRect => ({
        type: REFERENCE_TYPES.VOCABULARY,
        element: {
            height: targetRect.height,
            id,
            x: targetRect.left - pageDimensions.left,
            y: targetRect.top - pageDimensions.top,
            width: targetRect.width,
        },
    })));
};
