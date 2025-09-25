import { VocabularyReferenceElement, REFERENCE_TYPES } from "@repo/types";

import { InterractiveVocabularyAction } from "@/modules/files";

export const convertVocabularyAction = (vocAction: InterractiveVocabularyAction): Array<VocabularyReferenceElement> | null => {
    const { element } = vocAction;
    const { rectsArray, pageDimensions, id } = element;

    if (rectsArray.length < 0) return (null);

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
