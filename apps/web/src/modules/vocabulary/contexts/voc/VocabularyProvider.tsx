import { PropsWithChildren, useEffect, useState } from "react";

import { ActionColor, SavedVocabularyTerm } from "@repo/types";

import { useColorPanel } from "@/modules/colorPanel";
import { TRANSLATION } from "@/modules/translate";
import { useWorkspaces } from "@/modules/workspace";
import { getRgbColor, handleActionColor } from "@/utils";

import { GroupedVocabulary, WordToAdd } from "../../types";

import { AddTranslationParams, TranslationHelper, VocabularyContext } from "./VocabularyContext";

type HandleTranslationsParams = {
	readonly color: ActionColor;
	readonly id: string;
	readonly language: string;
	readonly text: string;
	readonly translations: Record<string, string>;
};

type VocabularyProviderProps =
    & { readonly vocabulary?: Array<GroupedVocabulary>; }
    & PropsWithChildren;
export const VocabularyProvider = ({ children, vocabulary: savedVoc }: VocabularyProviderProps) => {
	const [automatedTranslations, setAutomatedTranslations] = useState<Array<TranslationHelper>>([]);
    const [groupedVocabulary, setGroupedVocabulary] = useState<Array<GroupedVocabulary>>([]);

    const { colorPanel } = useColorPanel();
    const { currentWorkspace } = useWorkspaces();

    const getRightGroupIndex = (state: Array<GroupedVocabulary>, color: ActionColor) => (
        state.findIndex(group => (
            getRgbColor(handleActionColor(group.colorToUse, colorPanel)) === getRgbColor(handleActionColor(color, colorPanel))
        ))
    );

	const handleTranslations = async ({ color, id, language, text, translations }: HandleTranslationsParams) => {
		setAutomatedTranslations(prev => {
			const next = [...prev];

			const current: TranslationHelper = {
				color,
				id,
			};

			next.push(current);

			return (next);
		});

		const response = await TRANSLATION.translate({
			origin: language,
			targets: currentWorkspace!.languages.filter(el => el !== language),
			text,
		});

		if (!response.success) {
			throw new Error(`An error occured while retrieving translations - ${response.message}`);
		}

		const allTranslations = { 
			...translations,
			...response.data,
		};

		setGroupedVocabulary(prev => {
			const next = prev.map(group => ({ ...group, terms: [...group.terms] }));
			const groupIndex= getRightGroupIndex(next, color);
			if (groupIndex < 0) return (next);

			const group = next[groupIndex];
			const termIndex = group.terms.findIndex(term => term.id === id);
			if (termIndex < 0) return (next);

			const updatedTerm = { ...group.terms[termIndex] };
			updatedTerm.translations = allTranslations;
			
			group.terms[termIndex] = updatedTerm;
			next[groupIndex] = { ...group };
			return (next);
		});
		setAutomatedTranslations(prev => {
			const next = [...prev];

			const currentIndex = next.findIndex(el => (
				getRgbColor(handleActionColor(el.color, colorPanel))) === getRgbColor(handleActionColor(color, colorPanel)) &&
				el.id === id
			);
			if (currentIndex < 0) {
				return (next);
			}
			next.splice(currentIndex, 1);

			return (next);
		})
	};
    const addToVocabulary = async ({ color, ...rest }: WordToAdd) => {
		if (!currentWorkspace) {
			return;
		}
		const { languages } = currentWorkspace;

		const translations = Object.fromEntries(languages.map((lang) => [lang, ""]));

		translations[rest.language] = rest.text;

        const term: SavedVocabularyTerm = {
            color,
            id: rest.text,
            occurrence: {
				...rest, 
				pdfFileId: rest.pdfFileId ?? "",
			},
			translations,
        };

		handleTranslations({
			color,
			id: rest.text,
			language: rest.language,
			text: rest.text,
			translations,
		});

        setGroupedVocabulary(state => {
            const copy = state.map(group => ({ ...group, terms: [...group.terms] }));
            const groupIndex = getRightGroupIndex(copy, color);

            if (groupIndex === -1) {
                return ([...copy, { colorToUse: color, terms: [term] }]);
            }

            const group = copy[groupIndex];
            if (group.terms.some(term => term.id === rest.text)) return (copy);

            group.terms.push(term);
            copy[groupIndex] = group;
			
            return (copy);
        });
    };

    const addTranslation = (params: AddTranslationParams) => (
        setGroupedVocabulary(state => {
            const copy = state.map(group => ({ ...group, terms: [...group.terms] }));
            const groupIndex = getRightGroupIndex(copy, params.color);
            if (groupIndex < 0) return (copy);

            const group = copy[groupIndex];
            const termIndex = group.terms.findIndex(term => term.id === params.id);
            if (termIndex < 0) return (copy);

            const updated = { ...group.terms[termIndex] };
            const translations = { ...updated.translations };
            translations[params.locale] = params.translation;
            updated.translations = translations;

            group.terms[termIndex] = updated;
            copy[groupIndex] = { ...group };
            return (copy);
        })
    );

    const remove = (color: ActionColor, id: string) => (
        setGroupedVocabulary(state => {
            const copy = state.map(group => ({ ...group, terms: [...group.terms] }));
            const groupIndex = getRightGroupIndex(copy, color);
            if (groupIndex < 0) return (copy);

            const group = copy[groupIndex];
            const terms = group.terms.filter(t => t.id !== id);
            copy[groupIndex] = { ...group, terms };
            return (copy);
        })
    );

    const update = (color: ActionColor, id: string, item: SavedVocabularyTerm) => (
        setGroupedVocabulary(state => {
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

    useEffect(() => {
        if (savedVoc) setGroupedVocabulary(savedVoc);
    }, [savedVoc]);

    const value = {
		automatedTranslations,
        groupedVocabulary,
        addTranslation,
        addToVocabulary,
        remove,
        update,
    };

    return (
        <VocabularyContext.Provider value={value}>
            {children}
        </VocabularyContext.Provider>
    );
};
