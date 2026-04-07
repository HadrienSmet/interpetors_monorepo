import { PropsWithChildren, useEffect, useMemo, useState } from "react";

import { SavedVocabularyTerm } from "@repo/types";

import { useAuth } from "@/modules/auth";
import { useWorkspaces } from "@/modules/workspace";
import { decryptVocabularyTerms } from "@/utils";

import { getAllFromWorkspace } from "../../services";
import { groupVocabularyByColor } from "../../utils";

import { DictionaryContext, DictionaryContextValue } from "./DictionaryContext";

export const DictionaryProvider = ({ children }: PropsWithChildren) => {
    const [isLoading, setIsLoading] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(false);
    const [terms, setTerms] = useState<Array<SavedVocabularyTerm>>([]);

	const { userKey } = useAuth();
    const { currentWorkspace } = useWorkspaces();

    useEffect(() => {
        const fetchTerms = async () => {
            if (!currentWorkspace || !userKey) {
                return;
            }

            setIsLoading(true);
            const response = await getAllFromWorkspace(currentWorkspace.id);

            if (!response.success) {
                setIsLoading(false);
                throw new Error(response.message);
            }

			const decryptedVocabulary = await decryptVocabularyTerms(userKey, response.data);
            setTerms(decryptedVocabulary);
            setIsLoading(false);
        };

        if (shouldFetch) {
            fetchTerms();
        }
    }, [shouldFetch, currentWorkspace?.languages]);

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
