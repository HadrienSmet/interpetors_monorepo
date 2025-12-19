import { PropsWithChildren, useEffect, useMemo, useState } from "react";

import { SavedVocabularyTerm } from "@repo/types";

import { useWorkspaces } from "@/modules/workspace";

import { getAllFromWorkspace } from "../../services";
import { groupVocabularyByColor } from "../../utils";

import { DictionaryContext, DictionaryContextValue } from "./DictionaryContext";

export const DictionaryProvider = ({ children }: PropsWithChildren) => {
    const [isLoading, setIsLoading] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(false);
    const [terms, setTerms] = useState<Array<SavedVocabularyTerm>>([]);

    const { currentWorkspace } = useWorkspaces();

    useEffect(() => {
        const fetchTerms = async () => {
            if (!currentWorkspace) {
                return;
            }

            setIsLoading(true);
            const response = await getAllFromWorkspace(currentWorkspace.id);

            if (!response.success) {
                setIsLoading(false);
                throw new Error(response.message);
            }

            setTerms(response.data);
            setIsLoading(false);
        };

        if (shouldFetch) {
            fetchTerms();
        }
    }, [shouldFetch]);

    const groupedTerms = useMemo(() => (groupVocabularyByColor(terms)), [terms]);

    const value: DictionaryContextValue = {
        groupedTerms,
        isLoading,
        setShouldFetch,
        terms,
    };

    return (
        <DictionaryContext.Provider value={value}>
            {children}
        </DictionaryContext.Provider>
    );
};
