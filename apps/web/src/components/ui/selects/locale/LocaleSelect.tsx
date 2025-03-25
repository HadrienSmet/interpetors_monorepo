"use client";

import { ChangeEvent } from "react";

import { useTranslation } from "@/contexts";
import { languages } from "@/i18n/settings";

import { Select } from "../core";

export const LocaleSelect = () => {
    const { locale, switchLocale } = useTranslation();

    const onChange = (event: ChangeEvent<HTMLSelectElement>) => switchLocale(event.target.value);

    return (
        <Select
            onChange={onChange}
            defaultValue={locale}
            name="locale"
            options={languages.map(lang => ({ value: lang, label: lang.toUpperCase() }))}
        />
    );
};
