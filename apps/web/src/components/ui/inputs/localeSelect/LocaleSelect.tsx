"use client";

import { ChangeEvent } from "react";

import { useTranslation } from "@/contexts";
import { languages } from "@/i18n/settings";


export const LocaleSelect = () => {
    const { locale, switchLocale } = useTranslation();

    const onChange = (event: ChangeEvent<HTMLSelectElement>) => switchLocale(event.target.value);

    return (
        <select
            onChange={onChange}
            defaultValue={locale}
            name="language"
            id="language"
        >
            {languages.map((lang) => (
                <option key={lang} value={lang}>{lang.toUpperCase()}</option>
            ))}
        </select>
    );
};
