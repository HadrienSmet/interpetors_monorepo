import { ChangeEvent, KeyboardEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { InputStyleLess } from "@/components";
import { PdfVocabulary } from "@/modules/folders";

import { usePreparationVocabulary } from "../../../contexts";
type CellToFillProps = {
    readonly locale: string;
    readonly pdfVocabulary: PdfVocabulary;
};
export const CellToFill = (props: CellToFillProps) => {
    const [customTranslation, setCustomTranslation] = useState(props.pdfVocabulary.translations[props.locale] ?? "");
    const [isEditing, setIsEditing] = useState(false);

    const { addTranslation } = usePreparationVocabulary();
    const { t } = useTranslation();

    const onChange = (event: ChangeEvent<HTMLInputElement>) => setCustomTranslation(event.target.value);
    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            addTranslation({
                color: props.pdfVocabulary.color,
                id: props.pdfVocabulary.id,
                locale: props.locale,
                translation: customTranslation,
            });
            setIsEditing(false);
        };
    };

    if (
        !(props.locale in props.pdfVocabulary.translations) ||
        isEditing
    ) {
        return (
            <td className="vocabulary-table-cell">
                <InputStyleLess
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    placeholder={t("vocabulary.placeholder", { word: props.pdfVocabulary.occurence.text, language: props.locale })}
                    style={{ width: "100%" }}
                    value={customTranslation}
                />
            </td>
        );
    }

    return (
        <td className="vocabulary-table-cell">
            <button onDoubleClick={() => setIsEditing(true)}>
                {props.pdfVocabulary.translations[props.locale]}
            </button>
        </td>
    );
};
