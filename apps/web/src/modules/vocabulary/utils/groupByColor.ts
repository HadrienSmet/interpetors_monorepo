import { ActionColor, ColorKind, SavedVocabularyTerm } from "@repo/types";

import { GroupedVocabulary, PreparationVocabulary } from "../types";

const makeColorKey = (color: ActionColor): string => {
    if (color.kind === ColorKind.INLINE) {
        const { r, g, b } = color.value;

        return (`${color.kind}-${r.toFixed(3)}-${g.toFixed(3)}-${b.toFixed(3)}`);
    }

    return (`${color.kind}-${color.value}-${color.lastValue}`);
};

export const groupVocabularyByColor = (
    terms: Array<SavedVocabularyTerm> | undefined,
): PreparationVocabulary | undefined => {
    if (!terms) return (undefined);

    const map = new Map<string, GroupedVocabulary>();

    for (const term of terms) {
        const colorKey = makeColorKey(term.color);

        if (!map.has(colorKey)) {
            map.set(colorKey, {
                colorToUse: term.color,
                terms: [],
            });
        }

        map.get(colorKey)!.terms.push(term);
    }

    return (Array.from(map.values()));
};
