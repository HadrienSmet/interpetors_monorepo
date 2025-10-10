import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";

import { VocabularyTerm } from "@repo/types";

import { useColorPanel } from "@/modules/colorPanel";
import { useWorkspaces } from "@/modules/workspace";
import { getRgbColor, handleActionColor } from "@/utils";

import { usePreparationVocabulary } from "../preparation";

import { SortingIndex, sortingStateRecord, VocabularyTableContext, VocabularyTableContextValue } from "./VocabularyTableContext";

const getItemValue = (voc: VocabularyTerm, key: string, languages: Array<string>) => key === "sources"
    ? voc.occurence.text
    : voc.translations[languages.findIndex(lang => lang === key)];
export const VocabularyTableProvider = ({ children }: PropsWithChildren) => {
    const [searchingColumn, setSearchingColumn] = useState<string>("sources");
    const [sortingColumn, setSortingColumn] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState("");
    const [sortingStateIndex, setSortingStateIndex] = useState<SortingIndex>(0);

    const { colorPanel } = useColorPanel();
    const { preparationVocabulary } = usePreparationVocabulary();
    const { currentWorkspace } = useWorkspaces();

    const languages = useMemo(() => (
        currentWorkspace!.languages
    ), [currentWorkspace?.languages])

    const baseVocabulary: Record<string, Array<VocabularyTerm>> = useMemo(() => {
        const output: Record<string, Array<VocabularyTerm>> = {};

        for (const group of preparationVocabulary) {
            const rgbColor = handleActionColor(group.colorToUse, colorPanel);
            const color = getRgbColor(rgbColor);

            output[color] = group.terms;
        }

        return (output);
    }, [preparationVocabulary]);
    const filteredList: Record<string, Array<VocabularyTerm>> = useMemo(() => {
        if (!searchValue) {
            return (baseVocabulary);
        }

        const normalizedSearch = searchValue.toLowerCase();
        const output: Record<string, Array<VocabularyTerm>> = {};

        for (const clr in baseVocabulary) {
            const current = [...baseVocabulary[clr]];

            current.filter(term => {
                if (searchingColumn) {
                    const columnValue = getItemValue(term, searchingColumn, languages);

                    return (columnValue?.toLowerCase().includes(normalizedSearch));
                }

                return (Object.keys(term).some((key) => {
                    const value = getItemValue(term, key, languages);

                    return (value?.toLowerCase().includes(normalizedSearch));
                }));
            });

            output[clr] = current;
        }

        return (output);
    }, [baseVocabulary, searchValue, searchingColumn]);
    const sortedList: Array<VocabularyTerm> = useMemo(() => {
        const sortDirection = sortingStateRecord[sortingStateIndex];
        const vocList: Array<VocabularyTerm> = [];
        for (const clr in filteredList) {
            const current = filteredList[clr];

            // TODO might have to sort alphabetically the terms within the color segments
            vocList.push(...current.map(term => ({ ...term })));
        }

        if (sortDirection === "NONE" || !sortingColumn) {
            return (vocList);
        };

        return ([...vocList].sort((a, b) => {
            const aValue = getItemValue(a, sortingColumn, languages)?.toLowerCase() ?? "";
            const bValue = getItemValue(b, sortingColumn, languages)?.toLowerCase() ?? "";

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
