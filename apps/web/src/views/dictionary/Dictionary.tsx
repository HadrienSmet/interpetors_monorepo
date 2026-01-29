import { useEffect } from "react";

import { Loader } from "@/components";
import { useAuth } from "@/modules/auth";
import { useDictionary, VocabularyTable, VocabularyWrapper } from "@/modules/vocabulary";

export const Dictionary = () => {
	const { userKey } = useAuth();
    const { groupedTerms, isLoading, setShouldFetch } = useDictionary();

    useEffect(() => {
		if (!userKey) return;

        setShouldFetch(true);
    }, [userKey]);

    if (isLoading) {
        return (<Loader />);
    }
    return (
        <VocabularyWrapper groupedVocabulary={groupedTerms}>
            <main style={{ overflow: "hidden" }}>
                <VocabularyTable />
            </main>
        </VocabularyWrapper>
    );
};
