import { ChangeEventHandler } from "react";

import { useTranslation } from "@/contexts";

import { Select } from "../core";

import { languages } from "./allLanguages";

const getLanguageTranslation = (langCode: string, locale: string) => {
    try {
        return (new Intl.DisplayNames([locale], { type: "language" }).of(langCode));
    } catch {
        return (null);
    }
};
type LanguageSelectProps = {
    readonly backgroundColor?: string;
    readonly name: string;
    onChange: (language: string) => void
};
export const LanguageSelect = (props: LanguageSelectProps) => {
    const { locale } = useTranslation();

    const filteredLanguages: Array<string> = languages
        .map(language => getLanguageTranslation(language.code, locale))
        // TODO: Improve that filter...
        .filter(language => language != null)
        .filter(language => language.length > 2);
    const onChange: ChangeEventHandler<HTMLSelectElement> = (e) => props.onChange(e.target.value)

    return (
        <Select
            {...props}
            onChange={onChange}
            options={filteredLanguages.map(language => ({ value: language, label: language }))}
        />
    );
};
