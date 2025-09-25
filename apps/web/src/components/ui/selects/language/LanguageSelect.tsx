import { ChangeEventHandler, CSSProperties, useMemo } from "react";

import { capitalize, getNativeName, normalizeCode } from "@/utils";

import { Select, SelectOption } from "../core";

import { languages } from "./languageSelect.constants";

type LanguageSelectProps = {
    readonly name: string;
    readonly onChange: (language: string) => void;
    readonly style?: CSSProperties;
    readonly value?: string;
};
export const LanguageSelect = (props: LanguageSelectProps) => {
    const options: Array<SelectOption> = useMemo(() => {
        const output: Array<SelectOption> = [];

        for (const lng of languages) {
            const normalized = normalizeCode(lng.code);
            if (!normalized) {
                // Skip if don't succeed to normalize the code
                continue;
            }

            const autonym = getNativeName(normalized);
            if (!autonym) {
                // skip if runtime can not find the autonym
                continue;
            }

            output.push({
                value: normalized,
                label: capitalize(autonym),
            });
        }

        return (output.sort((a, b) => a.label!.localeCompare(b.label!)));
    }, []);

    const onChange: ChangeEventHandler<HTMLSelectElement> = (e) => (
        props.onChange(e.target.value)
    );

    return (
        <Select
            {...props}
            onChange={onChange}
            options={options}
        />
    );
};
