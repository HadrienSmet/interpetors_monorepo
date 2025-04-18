import { ChangeEvent } from "react";

import { useLocale } from "@/hooks";
import { SUPPORTED_LANGUAGES } from "@/i18n/translations";

import { Select } from "../core";

export const LocaleSelect = () => {
    const { locale, setLocale } = useLocale();

    const onChange = (event: ChangeEvent<HTMLSelectElement>) => setLocale(event.target.value);

    return (
        <Select
            defaultValue={locale}
            name="locale"
            onChange={onChange}
            options={Object.keys(SUPPORTED_LANGUAGES).map(lang => ({ value: lang, label: lang.toUpperCase() }))}
        />
    );
};
