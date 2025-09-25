import { PropsWithChildren, useState } from "react";

import { VocabularyTerm } from "@repo/types";

import { useWorkspaces } from "@/modules/workspace";

import { PreparationVocabulary, WordToAdd } from "../../types";

import { AddTranslationParams, PreparationVocabularyContext } from "./PreparationVocabularyContext";

export const PreparationVocabularyProvider = ({ children }: PropsWithChildren) => {
    const [vocabulary, setVocabulary] = useState<PreparationVocabulary>({});
    const { currentWorkspace } = useWorkspaces();

    const addToVocabulary = (word: WordToAdd) => {
        if (word.color in vocabulary && word.text in vocabulary[word.color]) {
            return;
        }

        const term: VocabularyTerm = {
            id: word.text,
            occurence: {
                filePath: word.filePath,
                pageIndex: word.pageIndex,
                text: word.text,
            },
            translations: Array(currentWorkspace?.languages.length).fill(""),
        };
        setVocabulary(state => {
            const copy = { ...state };

            if (!(word.color in copy)) {
                copy[word.color] = {};
            }

            copy[word.color][word.text] = term;

            return (copy);
        });
    };
    const addTranslation = (params: AddTranslationParams) => setVocabulary(state => {
        const copy = { ...state };

        if (
            params.color in copy &&
            params.id in copy[params.color]
        ) {
            copy[params.color][params.id].translations[params.localeIndex] = params.translation;
        }

        return (copy);
    });
    const remove = (color: string, id: string) => setVocabulary(state => {
        const copy = { ...state };

        delete copy[color][id];

        return (copy);
    });
    const update = (color: string, id: string, item: VocabularyTerm) => setVocabulary(state => {
        const copy = { ...state };

        const updated = {
            ...copy[color][id],
            ...item,
            color,
            id,
        };

        return ({
            ...copy,
            [color]: {
                ...copy[color],
                [id]: updated,
            },
        });
    });

    const value = {
        vocabulary,

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
