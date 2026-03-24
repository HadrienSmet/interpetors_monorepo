import { ChangeEvent, KeyboardEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { VocabularyTerm } from "@repo/types";

import { InputStyleLess, Loader } from "@/components";
import { useColorPanel } from "@/modules/colorPanel";
import { getNativeName, getRgbColor, handleActionColor } from "@/utils";

import { useVocabulary } from "../../../contexts";

type CellToFillProps = {
	readonly isEditable: boolean;
    readonly locale: string;
    readonly pdfVocabulary: VocabularyTerm;
};
export const CellToFill = ({ isEditable, locale, pdfVocabulary }: CellToFillProps) => {
    const [customTranslation, setCustomTranslation] = useState(pdfVocabulary.translations[locale] ?? "");
    const [isEditing, setIsEditing] = useState(false);

	const { colorPanel } = useColorPanel();
    const { addTranslation, automatedTranslations } = useVocabulary();
    const { t } = useTranslation();

    const onChange = (event: ChangeEvent<HTMLInputElement>) => setCustomTranslation(event.target.value);
	const onDoubleClick = () => {
		if (isEditable) setIsEditing(true);
	};
    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            addTranslation({
                ...pdfVocabulary,
                locale,
                translation: customTranslation,
            });
            setIsEditing(false);
        };
    };

	const isFetching = useMemo(() => {
		if (automatedTranslations.length === 0) {
			return (false);
		}
		const pdfRgb = getRgbColor(handleActionColor(pdfVocabulary.color, colorPanel));
		const index = automatedTranslations.findIndex(el => (
			pdfRgb === getRgbColor(handleActionColor(el.color, colorPanel)) &&
			pdfVocabulary.id === el.id
		));

		return (index !== -1);
	}, [pdfVocabulary, automatedTranslations]);

	if (isFetching) {
		return (
			<td className="vocabulary-table-cell">
				<Loader />
			</td>
		);
	}

    if (
        pdfVocabulary.translations[locale] === "" ||
        isEditing
    ) {
        return (
            <td className="vocabulary-table-cell">
                <InputStyleLess
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    placeholder={t(
                        "vocabulary.placeholders.cell",
                        {
                            language: getNativeName(locale),
                            word: pdfVocabulary.occurrence.text,
                        })}
                    style={{
                        textOverflow: "ellipsis",
                        width: "100%",
                    }}
                    value={customTranslation}
                />
            </td>
        );
    }

    return (
        <td className="vocabulary-table-cell">
            <button
                onDoubleClick={onDoubleClick}
                style={{ maxWidth: "100%" }}
                title={t("actions.editOnDoubleClick")}
            >
                {pdfVocabulary.translations[locale]}
            </button>
        </td>
    );
};
