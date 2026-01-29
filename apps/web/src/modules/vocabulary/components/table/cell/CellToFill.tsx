import { ChangeEvent, KeyboardEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { VocabularyTerm } from "@repo/types";

import { InputStyleLess } from "@/components";
import { getNativeName } from "@/utils";

import { useVocabulary } from "../../../contexts";

type CellToFillProps = {
	readonly isEditable: boolean;
    readonly locale: string;
    readonly localeIndex: number;
    readonly pdfVocabulary: VocabularyTerm;
};
export const CellToFill = ({ isEditable, locale, localeIndex, pdfVocabulary }: CellToFillProps) => {
    const [customTranslation, setCustomTranslation] = useState(pdfVocabulary.translations[localeIndex] ?? "");
    const [isEditing, setIsEditing] = useState(false);

    const { addTranslation } = useVocabulary();
    const { t } = useTranslation();

    const onChange = (event: ChangeEvent<HTMLInputElement>) => setCustomTranslation(event.target.value);
	const onDoubleClick = () => {
		if (isEditable) setIsEditing(true);
	};
    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            addTranslation({
                ...pdfVocabulary,
                localeIndex,
                translation: customTranslation,
            });
            setIsEditing(false);
        };
    };

    if (
        pdfVocabulary.translations[localeIndex] === "" ||
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
                {pdfVocabulary.translations[localeIndex]}
            </button>
        </td>
    );
};
