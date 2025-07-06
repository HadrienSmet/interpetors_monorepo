import { PropsWithChildren, useCallback, useMemo, useState } from "react";

import { PdfVocabulary } from "@/modules/folders";

import { usePreparationVocabulary } from "../preparation";

import { SortingIndex, sortingStateRecord, VocabularyTableContext, VocabularyTableContextValue } from "./VocabularyTableContext";

const getItemValue = (voc: PdfVocabulary, key: string) => key === "sources"
    ? voc.occurence.text
    : voc.translations[key];
export const VocabularyTableProvider = ({ children }: PropsWithChildren) => {
    const [searchingColumn, setSearchingColumn] = useState<string>("sources");
    const [sortingColumn, setSortingColumn] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState("");
    const [sortingStateIndex, setSortingStateIndex] = useState<SortingIndex>(0);

    const { vocabulary } = usePreparationVocabulary();

    const baseVocabulary: Array<PdfVocabulary> = useMemo(() => {
        const output = [];

        for (const clr in vocabulary) {
            for (const id in vocabulary[clr]) {
                output.push(vocabulary[clr][id]);
            }
        }

        return (output);
    }, [vocabulary]);
    const filteredList = useMemo(() => {
        if (!searchValue) return baseVocabulary;

        const normalizedSearch = searchValue.toLowerCase();

        return (baseVocabulary.filter((item) => {
            if (searchingColumn) {
                const columnValue = getItemValue(item, searchingColumn);

                return (columnValue?.toLowerCase().includes(normalizedSearch));
            }

            // Full row search
            return (Object.keys(item).some((key) => {
                const value = getItemValue(item, key);

                return (value?.toLowerCase().includes(normalizedSearch));
            }));
        }));
    }, [baseVocabulary, searchValue, searchingColumn]);
    const sortedList = useMemo(() => {
        const sortDirection = sortingStateRecord[sortingStateIndex];

        if (sortDirection === "NONE" || !searchingColumn) return (filteredList);

        return ([...filteredList].sort((a, b) => {
            const aValue = getItemValue(a, searchingColumn)?.toLowerCase() ?? "";
            const bValue = getItemValue(b, searchingColumn)?.toLowerCase() ?? "";

            if (aValue < bValue) return sortDirection === "ASC" ? -1 : 1;
            if (aValue > bValue) return sortDirection === "ASC" ? 1 : -1;

            return (0);
        }));
    }, [filteredList, sortingStateIndex, searchingColumn]);
    const toggleSortDirection = useCallback(() => {
        setSortingStateIndex((prev) => ((prev + 1) % Object.keys(sortingStateRecord).length) as SortingIndex);
    }, []);

    const value: VocabularyTableContextValue = {
        list: sortedList,
        searchingColumn,
        sortingColumn,
        sortingState: sortingStateRecord[sortingStateIndex],
        setSearchingColumn,
        setSearchValue,
        setSortingColumn,
        toggleSortDirection,
    };

    return (
        <VocabularyTableContext.Provider value={value}>
            {children}
        </VocabularyTableContext.Provider>
    );
};
