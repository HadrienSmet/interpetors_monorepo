import { useEffect, useMemo, useState } from "react";

import { SavedVocabularyTerm } from "@repo/types";

import { Loader } from "@/components";
import { groupVocabularyByColor, VOCABULARY, VocabularyTable, VocabularyWrapper } from "@/modules/vocabulary";
import { useWorkspaces } from "@/modules/workspace";

export const Dictionary = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [terms, setTerms] = useState<Array<SavedVocabularyTerm>>([]);

    const { currentWorkspace } = useWorkspaces();

    useEffect(() => {
        const fetchTerms = async () => {
            if (!currentWorkspace) {
                return;
            }

            setIsLoading(true);
            const response = await VOCABULARY.getAllFromWorkspace(currentWorkspace.id);

            if (!response.success) {
                setIsLoading(false);
                throw new Error(response.message);
            }

            setTerms(response.data);
            setIsLoading(false);
        };

        fetchTerms();
    }, []);

    const grouped = useMemo(() => (groupVocabularyByColor(terms)), [terms]);

    if (isLoading) {
        return (<Loader />);
    }
    return (
        <VocabularyWrapper groupedVocabulary={grouped}>
            <main style={{ overflow: "hidden" }}>
                <VocabularyTable />
            </main>
        </VocabularyWrapper>
    );
};
