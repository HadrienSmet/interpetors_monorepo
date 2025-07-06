import { createContext, useContext } from "react";

import { getContextError } from "@/contexts/utils";
import { PdfVocabulary } from "@/modules/folders";

export const sortingStateRecord = {
    0: "NONE",
    1: "ASC",
    2: "DESC",
} as const;
export type SortingIndex = keyof typeof sortingStateRecord;
export type SortingState = typeof sortingStateRecord[SortingIndex];

export type VocabularyTableContextValue = {
    readonly list: Array<PdfVocabulary>;
    readonly searchingColumn: string;
    readonly sortingColumn: string | null;
    readonly sortingState: SortingState;

    readonly setSearchingColumn: (id: string) => void;
    readonly setSearchValue: (search: string) => void;
    readonly setSortingColumn: (id: string) => void;
    readonly toggleSortDirection: () => void;
};

export const VocabularyTableContext = createContext<VocabularyTableContextValue | null>(null);

export const useVocabularyTable = () => {
    const ctx = useContext(VocabularyTableContext);

    if (!ctx) {
        throw new Error(getContextError("useVocabularyTable", "VocabularyTableProvider"));
    }

    return (ctx);
};
