import { createContext, useContext } from "react";

import { ActionColor, SavedVocabularyTerm } from "@repo/types";

import { getContextError } from "@/contexts/utils";

import { PreparationVocabulary, WordToAdd } from "../../types";

export type AddTranslationParams = {
    readonly color: ActionColor;
    readonly id: string;
    readonly localeIndex: number;
    readonly translation: string;
};
type PreparationVocabularyContextType = {
    readonly preparationVocabulary: PreparationVocabulary;

    readonly addToVocabulary: (word: WordToAdd) => void;
    readonly addTranslation: (params: AddTranslationParams) => void;
    readonly remove: (color: ActionColor, id: string) => void;
    readonly update: (color: ActionColor, id: string, item: SavedVocabularyTerm) => void;
};

export const PreparationVocabularyContext = createContext<PreparationVocabularyContextType | null>(null);

export const usePreparationVocabulary = () => {
    const ctx = useContext(PreparationVocabularyContext);

    if (!ctx) {
        throw new Error(getContextError("usePreparationVocabulary", "PreparationVocabularyProvider"));
    }

    return (ctx);
};
