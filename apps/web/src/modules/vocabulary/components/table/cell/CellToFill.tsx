import { ChangeEvent, KeyboardEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { VocabularyTerm } from "@repo/types";

import { InputStyleLess } from "@/components";
import { getNativeName } from "@/utils";

import { usePreparationVocabulary } from "../../../contexts";

type CellToFillProps = {
    readonly locale: string;
    readonly localeIndex: number;
    readonly pdfVocabulary: VocabularyTerm;
};
export const CellToFill = (props: CellToFillProps) => {
    const [customTranslation, setCustomTranslation] = useState(props.pdfVocabulary.translations[props.localeIndex] ?? "");
    const [isEditing, setIsEditing] = useState(false);

    const { addTranslation } = usePreparationVocabulary();
    const { t } = useTranslation();

    const onChange = (event: ChangeEvent<HTMLInputElement>) => setCustomTranslation(event.target.value);
    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            addTranslation({
                ...props.pdfVocabulary,
                ...props,
                translation: customTranslation,
            });
            setIsEditing(false);
        };
    };

    if (
        props.pdfVocabulary.translations[props.localeIndex] === "" ||
        isEditing
    ) {
        return (
            <td className="vocabulary-table-cell">
                <InputStyleLess
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    placeholder={t("vocabulary.placeholders.cell", { word: props.pdfVocabulary.occurrence.text, language: getNativeName(props.locale) })}
                    style={{ width: "100%" }}
                    value={customTranslation}
                />
            </td>
        );
    }

    return (
        <td className="vocabulary-table-cell">
            <button
                onDoubleClick={() => setIsEditing(true)}
                title={t("actions.editOnDoubleClick")}
            >
                {props.pdfVocabulary.translations[props.localeIndex]}
            </button>
        </td>
    );
};
