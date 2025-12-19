import { useEffect } from "react";

import { Loader } from "@/components";
import { useDictionary, VocabularyTable, VocabularyWrapper } from "@/modules/vocabulary";

export const Dictionary = () => {
    const { groupedTerms, isLoading, setShouldFetch } = useDictionary();

    useEffect(() => {
        setShouldFetch(true);
    }, []);

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
