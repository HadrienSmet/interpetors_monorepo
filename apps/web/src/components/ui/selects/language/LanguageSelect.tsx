import { ChangeEventHandler, CSSProperties, useMemo } from "react";

import { capitalize, getNativeName, languages, normalizeCode } from "@/utils";

import { Select, SelectOption } from "../core";

type LanguageSelectProps = {
    readonly name: string;
    readonly onChange: (language: string) => void;
	/** List of languages code to put in front of rest of languages */
	readonly recommandedItems?: Array<string>; 
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

		const sorted = output.sort((a, b) => a.label!.localeCompare(b.label!));
		const recommanded: Array<SelectOption> = [];

		if (props.recommandedItems) {
			for (const lng of props.recommandedItems) {
				const normalized = normalizeCode(lng);
				const lngInSortedIndex = sorted.findIndex(el => el.value === normalized);
				sorted.splice(lngInSortedIndex, 1);

				if (!normalized) {
					// Skip if don't succeed to normalize the code
					continue;
				}

				const autonym = getNativeName(normalized);
				if (!autonym) {
					// skip if runtime can not find the autonym
					continue;
				}

				recommanded.push({
					value: normalized,
					label: capitalize(autonym),
				});
			}
		}

        return ([...recommanded, ...sorted]);
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
