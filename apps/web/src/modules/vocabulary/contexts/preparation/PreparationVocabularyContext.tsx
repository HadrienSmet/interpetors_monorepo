import { createContext, useContext } from "react";

import { VocabularyTerm } from "@repo/types";

import { getContextError } from "@/contexts/utils";

import { PreparationVocabulary, WordToAdd } from "../../types";

export type AddTranslationParams = {
    readonly color: string;
    readonly id: string;
    readonly localeIndex: number;
    readonly translation: string;
};
type PreparationVocabularyContextType = {
    readonly vocabulary: PreparationVocabulary;

    readonly addToVocabulary: (word: WordToAdd) => void;
    readonly addTranslation: (params: AddTranslationParams) => void;
    readonly remove: (color: string, id: string) => void;
    readonly update: (color: string, id: string, item: VocabularyTerm) => void;
};

export const PreparationVocabularyContext = createContext<PreparationVocabularyContextType | null>(null);

export const usePreparationVocabulary = () => {
    const ctx = useContext(PreparationVocabularyContext);

    if (!ctx) {
        throw new Error(getContextError("usePreparationVocabulary", "PreparationVocabularyProvider"));
    }

    return (ctx);
};
