import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";

import { SavedVocabularyTerm, VocabularyTerm } from "@repo/types";

import { useColorPanel } from "@/modules/colorPanel";
import { getRgbColor, handleActionColor } from "@/utils";

import { useVocabulary } from "../voc";

import { SortingIndex, sortingStateRecord, VocabularyTableContext, VocabularyTableContextValue } from "./VocabularyTableContext";

const getItemValue = (voc: VocabularyTerm, key: string) => key === "sources"
    ? voc.occurrence.text
    : voc.translations[key];

export const VocabularyTableProvider = ({ children }: PropsWithChildren) => {
    const [searchingColumn, setSearchingColumn] = useState<string>("sources");
    const [sortingColumn, setSortingColumn] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState("");
    const [sortingStateIndex, setSortingStateIndex] = useState<SortingIndex>(0);

    const { colorPanel } = useColorPanel();
    const { groupedVocabulary } = useVocabulary();

    const baseVocabulary: Record<string, Array<SavedVocabularyTerm>> = useMemo(() => {
        const output: Record<string, Array<SavedVocabularyTerm>> = {};

        for (const group of groupedVocabulary) {
            const rgbColor = handleActionColor(group.colorToUse, colorPanel);
            const color = getRgbColor(rgbColor);

            output[color] = group.terms;
        }

        return (output);
    }, [groupedVocabulary]);
    const filteredList: Record<string, Array<SavedVocabularyTerm>> = useMemo(() => {
        if (!searchValue) {
            return (baseVocabulary);
        }

        const normalizedSearch = searchValue.toLowerCase();
        const output: Record<string, Array<SavedVocabularyTerm>> = {};

        for (const clr in baseVocabulary) {
            const current = [...baseVocabulary[clr]];

            current.filter(term => {
                if (searchingColumn) {
                    const columnValue = getItemValue(term, searchingColumn);

                    return (columnValue?.toLowerCase().includes(normalizedSearch));
                }

                return (Object.keys(term).some((key) => {
                    const value = getItemValue(term, key);

                    return (value?.toLowerCase().includes(normalizedSearch));
                }));
            });

            output[clr] = current;
        }

        return (output);
    }, [baseVocabulary, searchValue, searchingColumn]);
    const sortedList: Array<SavedVocabularyTerm> = useMemo(() => {
        const sortDirection = sortingStateRecord[sortingStateIndex];
        const vocList: Array<SavedVocabularyTerm> = [];
        for (const clr in filteredList) {
            const current = filteredList[clr];

            // TODO might have to sort alphabetically the terms within the color segments
            vocList.push(...current.map(term => ({ ...term })));
        }

        if (sortDirection === "NONE" || !sortingColumn) {
            return (vocList);
        };

        return ([...vocList].sort((a, b) => {
            const aValue = getItemValue(a, sortingColumn)?.toLowerCase() ?? "";
            const bValue = getItemValue(b, sortingColumn)?.toLowerCase() ?? "";

            if (aValue < bValue) return (sortDirection === "ASC" ? -1 : 1);
            if (aValue > bValue) return (sortDirection === "ASC" ? 1 : -1);

            return (0);
        }));
    }, [filteredList, sortingStateIndex, sortingColumn]);
    const toggleSortDirection = useCallback(() => {
        setSortingStateIndex((prev) => ((prev + 1) % Object.keys(sortingStateRecord).length) as SortingIndex);
    }, []);

    useEffect(() => {
        if (sortingColumn !== null) {
            setSortingStateIndex(1);
        }
    }, [sortingColumn]);

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
