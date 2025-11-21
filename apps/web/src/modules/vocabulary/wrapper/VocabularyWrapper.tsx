import { PropsWithChildren } from "react";
import { GroupedVocabulary } from "../types";
import { VocabularyProvider, VocabularyTableProvider } from "../contexts";

type VocabularyWrapperProps =
    & { readonly groupedVocabulary?: Array<GroupedVocabulary>; }
    & PropsWithChildren;
export const VocabularyWrapper = ({ children, groupedVocabulary }: VocabularyWrapperProps) => (
    <VocabularyProvider vocabulary={groupedVocabulary}>
        <VocabularyTableProvider>
            {children}
        </VocabularyTableProvider>
    </VocabularyProvider>
);
