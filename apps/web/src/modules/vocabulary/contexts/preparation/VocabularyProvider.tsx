import { PropsWithChildren, useState } from "react";

import { PdfVocabulary } from "@/modules/folders";

import { PreparationVocabulary, WordToAdd } from "../../types";

import { AddTranslationParams, PreparationVocabularyContext } from "./VocabularyContext";

export const PreparationVocabularyProvider = ({ children }: PropsWithChildren) => {
    const [vocabulary, setVocabulary] = useState<PreparationVocabulary>({});

    const addToVocabulary = (word: WordToAdd) => {
        // TODO two methods vocToId & idToVoc
        const wordAsId = word.text.split(" ").join("-");

        if (word.color in vocabulary && wordAsId in vocabulary[word.color]) {
            return;
        }

        setVocabulary(state => {
            const copy = { ...state };

            if (!(word.color in copy)) {
                copy[word.color] = {};
            }

            copy[word.color][wordAsId] = {
                color: word.color,
                id: wordAsId,
                occurence: { ...word },
                translations: {},
            };

            return (copy);
        });
    };
    const addTranslation = (params: AddTranslationParams) => setVocabulary(state => {
        const copy = { ...state };

        if (
            params.color in copy &&
            params.id in copy[params.color]
        ) {
            copy[params.color][params.id].translations[params.locale] = params.translation
        }

        return (copy);
    });
    const remove = (color: string, id: string) => setVocabulary(state => {
        const copy = { ...state };

        delete copy[color][id];

        return (copy);
    });
    const update = (color: string, id: string, item: PdfVocabulary) => setVocabulary(state => {
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
