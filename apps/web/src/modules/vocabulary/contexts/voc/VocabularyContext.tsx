import { createContext, useContext } from "react";

import { ActionColor, SavedVocabularyTerm } from "@repo/types";

import { getContextError } from "@/contexts/utils";

import { GroupedVocabulary, WordToAdd } from "../../types";

export type AddTranslationParams = {
    readonly color: ActionColor;
    readonly id: string;
    readonly localeIndex: number;
    readonly translation: string;
};
type VocabularyContextType = {
    readonly groupedVocabulary: Array<GroupedVocabulary>;

    readonly addToVocabulary: (word: WordToAdd) => void;
    readonly addTranslation: (params: AddTranslationParams) => void;
    readonly remove: (color: ActionColor, id: string) => void;
    readonly update: (color: ActionColor, id: string, item: SavedVocabularyTerm) => void;
};

export const VocabularyContext = createContext<VocabularyContextType | null>(null);

export const useVocabulary = () => {
    const ctx = useContext(VocabularyContext);

    if (!ctx) {
        throw new Error(getContextError("useVocabulary", "VocabularyProvider"));
    }

    return (ctx);
};
