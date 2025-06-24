import { createContext, useContext } from "react";

import { getContextError } from "@/contexts/utils";

import { VocabularyInPreparation, PreparationVocabulary, WordToAdd } from "../../types";

export type AddTranslationParams = {
    readonly color: string;
    readonly id: string;
    readonly locale: string;
    readonly translation: string;
};
type PreparationVocabularyContextType = {
    readonly vocabulary: PreparationVocabulary;

    readonly addToVocabulary: (word: WordToAdd) => void;
    readonly addTranslation: (params: AddTranslationParams) => void;
    readonly remove: (color: string, id: string) => void;
    readonly update: (color: string, id: string, item: VocabularyInPreparation) => void;
};

export const PreparationVocabularyContext = createContext<PreparationVocabularyContextType | null>(null);

export const usePreparationVocabulary = () => {
    const ctx = useContext(PreparationVocabularyContext);

    if (!ctx) {
        throw new Error(getContextError("useVocabulary", "VocabularyProvider"));
    }

    return (ctx);
};
