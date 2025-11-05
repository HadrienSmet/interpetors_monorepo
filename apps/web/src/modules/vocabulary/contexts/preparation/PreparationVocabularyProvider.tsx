import { PropsWithChildren, useState } from "react";

import { ActionColor, VocabularyTerm } from "@repo/types";

import { useColorPanel } from "@/modules/colorPanel";
import { useWorkspaces } from "@/modules/workspace";
import { getRgbColor, handleActionColor } from "@/utils";

import { PreparationVocabulary, WordToAdd } from "../../types";

import { AddTranslationParams, PreparationVocabularyContext } from "./PreparationVocabularyContext";

export const PreparationVocabularyProvider = ({ children }: PropsWithChildren) => {
    const [preparationVocabulary, setPreparationVocabulary] = useState<PreparationVocabulary>([]);

    const { colorPanel } = useColorPanel();
    const { currentWorkspace } = useWorkspaces();

    const getRightGroupIndex = (state: PreparationVocabulary, color: ActionColor) => (
        state.findIndex(group => (
            getRgbColor(handleActionColor(group.colorToUse, colorPanel)) === getRgbColor(handleActionColor(color, colorPanel))
        ))
    );

    const addToVocabulary = (word: WordToAdd) => {
        // Should be defined by the API
        const termId = word.text;

        const term: VocabularyTerm = {
            id: termId,
            color: word.color,
            occurrence: {
                filePath: word.filePath,
                pageIndex: word.pageIndex,
                text: word.text,
            },
            translations: Array(currentWorkspace?.languages.length ?? 0).fill(""),
        };

        setPreparationVocabulary(state => {
            const copy = state.map(group => ({ ...group, terms: [...group.terms] }));
            const groupIndex = getRightGroupIndex(copy, word.color);

            if (groupIndex === -1) {
                return ([...copy, { colorToUse: word.color, terms: [term] }]);
            }

            const group = copy[groupIndex];
            if (group.terms.some(term => term.id === termId)) return (copy);

            group.terms.push(term);
            copy[groupIndex] = group;
            return (copy);
        });
    };

    const addTranslation = (params: AddTranslationParams) => (
        setPreparationVocabulary(state => {
            const copy = state.map(group => ({ ...group, terms: [...group.terms] }));
            const groupIndex = getRightGroupIndex(copy, params.color);
            if (groupIndex < 0) return (copy);

            const group = copy[groupIndex];
            const termIndex = group.terms.findIndex(term => term.id === params.id);
            if (termIndex < 0) return (copy);

            const updated = { ...group.terms[termIndex] };
            const translations = [...updated.translations];
            translations[params.localeIndex] = params.translation;
            updated.translations = translations;

            group.terms[termIndex] = updated;
            copy[groupIndex] = { ...group };
            return (copy);
        })
    );

    const remove = (color: ActionColor, id: string) => (
        setPreparationVocabulary(state => {
            const copy = state.map(group => ({ ...group, terms: [...group.terms] }));
            const groupIndex = getRightGroupIndex(copy, color);
            if (groupIndex < 0) return (copy);

            const group = copy[groupIndex];
            const terms = group.terms.filter(t => t.id !== id);
            copy[groupIndex] = { ...group, terms };
            return (copy);
        })
    );

    const update = (color: ActionColor, id: string, item: VocabularyTerm) => (
        setPreparationVocabulary(state => {
            const copy = state.map(group => ({ ...group, terms: [...group.terms] }));
            const groupIndex = getRightGroupIndex(copy, color);
            if (groupIndex < 0) return (copy);

            const group = copy[groupIndex];
            const termIndex = group.terms.findIndex(term => term.id === id);
            if (termIndex < 0) return (copy);

            group.terms[termIndex] = { ...item };
            copy[groupIndex] = { ...group };
            return (copy);
        })
    );

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
