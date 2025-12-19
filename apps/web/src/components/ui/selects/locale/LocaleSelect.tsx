import { ChangeEvent } from "react";

import { useLocale } from "@/hooks";
import { SUPPORTED_LANGUAGES } from "@/i18n/languages";

import { Select } from "../core";

export const LocaleSelect = () => {
    const { setLocale } = useLocale();

    const onChange = (event: ChangeEvent<HTMLSelectElement>) =>
        setLocale(event.target.value);

    return (
        <Select
            name="locale"
            onChange={onChange}
            options={Object.keys(SUPPORTED_LANGUAGES).map(lang => ({
                value: lang,
                label: lang.toUpperCase(),
            }))}
        />
    );
};
