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

export const LanguageSelect = () => {
    const { locale } = useTranslation();

    const filteredLanguages: Array<string> = languages
        .map(language => getLanguageTranslation(language.code, locale))
        // TODO: Improve that filter...
        .filter(language => language != null)
        .filter(language => language.length > 2);

    return (
        <Select
            name="languages"
            onChange={(e) => console.log(e.target.value)}
            options={filteredLanguages.map(language => ({ value: language, label: language }))}
        />
    );
};
