import { ChangeEventHandler, CSSProperties } from "react";

import { useLocale } from "@/hooks";

import { Select } from "../core";

import { languages } from "./languageSelect.constants";

const getLanguageTranslation = (langCode: string, locale: string) => {
    try {
        return (new Intl.DisplayNames([locale], { type: "language" }).of(langCode));
    } catch {
        return (null);
    }
};
type LanguageSelectProps = {
    readonly name: string;
    readonly onChange: (language: string) => void;
    readonly style?: CSSProperties;
};
export const LanguageSelect = (props: LanguageSelectProps) => {
    const { locale } = useLocale();

    const filteredLanguages = languages
        .map(language => getLanguageTranslation(language.code, locale))
        // TODO: Improve that filter...
        .filter((language): language is string => language != null)
        .filter(language => language.length > 2)
        .sort();
    const onChange: ChangeEventHandler<HTMLSelectElement> = (e) => props.onChange(e.target.value)

    return (
        <Select
            {...props}
            onChange={onChange}
            options={filteredLanguages.map(language => ({ value: language, label: language }))}
        />
    );
};
