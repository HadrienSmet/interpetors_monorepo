import { PropsWithChildren, useState } from "react";

import { CanvasColor, VocabularyTerm } from "@repo/types";

import { useWorkspaces } from "@/modules/workspace";

import { PreparationVocabulary, WordToAdd } from "../../types";

import { AddTranslationParams, PreparationVocabularyContext } from "./PreparationVocabularyContext";

export const PreparationVocabularyProvider = ({ children }: PropsWithChildren) => {
    const [preparationVocabulary, setPreparationVocabulary] = useState<PreparationVocabulary>([]);
    const { currentWorkspace } = useWorkspaces();

    const getRightGroupIndex = (state: PreparationVocabulary, color: CanvasColor) => (
        state.findIndex(group => (
            group.colorToUse.kind === color.kind &&
            group.colorToUse.value === color.value
        ))
    );

    const addToVocabulary = (word: WordToAdd) => {
        // TODO: Need to check that word is not already presents
        // if (word.color in vocabulary && word.text in vocabulary[word.color]) {
        //     return;
        // }

        const term: VocabularyTerm = {
            id: word.text,
            color: word.color,
            occurence: {
                filePath: word.filePath,
                pageIndex: word.pageIndex,
                text: word.text,
            },
            translations: Array(currentWorkspace?.languages.length).fill(""),
        };

        setPreparationVocabulary(state => {
            const copy = [...state];

            if (copy.length === 0) {
                copy.push({
                    colorToUse: word.color,
                    terms: [term],
                });

                return (copy);
            }

            const groupIndex = getRightGroupIndex(copy, word.color);
            if (groupIndex < 0) {
                copy.push({
                    colorToUse: word.color,
                    terms: [term],
                });

                return (copy);
            }

            const group = copy[groupIndex];
            group.terms.push(term);
            return (copy.splice(groupIndex, 1, group));
        });
    };

    const addTranslation = (params: AddTranslationParams) => setPreparationVocabulary(state => {
        const copy = [...state];

        const groupIndex = getRightGroupIndex(copy, params.color);
        if (groupIndex < 0) {
            return (copy);
        }

        const group = copy[groupIndex];
        const termIndex = group.terms.findIndex(term => term.id === params.id);
        if (termIndex > 0) {
            return (copy);
        }

        const term = group.terms[termIndex];
        term.translations[params.localeIndex] = params.translation;

        const updatedGroup = {
            ...group,
            terms: group.terms.splice(termIndex, 1, term),
        };

        return (copy.splice(groupIndex, 1, updatedGroup));
    });
    const remove = (color: CanvasColor, id: string) => setPreparationVocabulary(state => {
        const copy = [...state];

        const groupIndex = getRightGroupIndex(copy, color);
        if (groupIndex < 0) {
            return (copy);
        }

        const group = copy[groupIndex];
        const termIndex = group.terms.findIndex(term => term.id === id);
        if (termIndex < 0) {
            return (copy);
        }

        const updatedGroup = {
            ...group,
            terms: group.terms.splice(termIndex, 1),
        };

        return (copy.splice(groupIndex, 1, updatedGroup));
    });
    const update = (color: CanvasColor, id: string, item: VocabularyTerm) => setPreparationVocabulary(state => {
        const copy = [...state];

        const groupIndex = getRightGroupIndex(copy, color);
        if (groupIndex < 0) {
            return (copy);
        }

        const group = copy[groupIndex];
        const termIndex = group.terms.findIndex(term => term.id === id);

        const updatedGroup = {
            ...group,
            terms: group.terms.splice(termIndex, 1, item),
        };

        return (copy.splice(groupIndex, 1, updatedGroup));
    });

    const value = {
        preparationVocabulary,

        addTranslation,
        addToVocabulary,
        remove,
        update,
    };

    return (
        <PreparationVocabularyContext.Provider value={value}>
            {children}
        </PreparationVocabularyContext.Provider>
    );
};
