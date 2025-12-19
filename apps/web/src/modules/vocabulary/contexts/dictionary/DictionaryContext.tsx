import { createContext, Dispatch, SetStateAction, useContext } from "react";

import { SavedVocabularyTerm } from "@repo/types";

import { getContextError } from "@/contexts/utils";

import { GroupedVocabulary } from "../../types";

export type DictionaryContextValue = {
    readonly groupedTerms: Array<GroupedVocabulary> | undefined;
    readonly isLoading: boolean;
    readonly setShouldFetch: Dispatch<SetStateAction<boolean>>;
    readonly terms: Array<SavedVocabularyTerm>;
};
export const DictionaryContext = createContext<DictionaryContextValue | null>(null);

export const useDictionary = () => {
    const ctx = useContext(DictionaryContext);

    if (!ctx) {
        throw new Error(getContextError("useDictionary", "DictionaryProvider"));
    }

    return (ctx);
};
