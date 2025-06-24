import { ChangeEvent, KeyboardEvent, useState } from "react";
import { MdLink } from "react-icons/md";
import { Link } from "react-router-dom";

import { InputStyleLess } from "@/components";
import { useWorkSpaces } from "@/contexts";

import { usePreparationVocabulary } from "../../contexts";
import { PreparationVocabulary, VocabularyInPreparation } from "../../types";

import "./vocabularyTable.scss";

type VocabularyTableRowProps = {
    readonly vocInPrep: VocabularyInPreparation;
};
const CellToFill = (props: VocabularyTableRowProps & { locale: string; }) => {
    const [customTranslation, setCustomTranslation] = useState(props.vocInPrep.translations[props.locale] ?? "");
    const [isEditing, setIsEditing] = useState(false);

    const { addTranslation } = usePreparationVocabulary();

    const onChange = (event: ChangeEvent<HTMLInputElement>) => setCustomTranslation(event.target.value);
    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                addTranslation({
                    color: props.vocInPrep.color,
                    id: props.vocInPrep.id,
                    locale: props.locale,
                    translation: customTranslation,
                });
                setIsEditing(false);
            };
        };

    if (
        !(props.locale in props.vocInPrep.translations) ||
        isEditing
    ) {
        return (
            <td className="vocabulary-table-cell">
                <InputStyleLess
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    value={customTranslation}
                />
            </td>
        );
    }

    return (
        <td className="vocabulary-table-cell">
            <button onDoubleClick={() => setIsEditing(true)}>
                {props.vocInPrep.translations[props.locale]}
            </button>
        </td>
    );
};

const VocabularyTableRow = (props: VocabularyTableRowProps) => {
    const { currentWorkSpace } = useWorkSpaces();

    const { work } = currentWorkSpace!.languages;

    return (
        <tr className="vocabulary-table-row">
            <td className="vocabulary-table-cell">
                <Link to={`/prepare/files?filepath=${props.vocInPrep.filePath}`}>
                    <MdLink />
                    <em>{props.vocInPrep.text}</em>
                </Link>
            </td>
            {work.map(lng => (
                <CellToFill
                    {...props}
                    key={`cell-to-fill-${lng}-${props.vocInPrep.text}`}
                    locale={lng}
                />
            ))}
        </tr>
    );
};
export const VocabularyTable = ({ list }: { list: PreparationVocabulary; }) => {
    const { currentWorkSpace } = useWorkSpaces();

    const { native, work } = currentWorkSpace!.languages;

    return (
        <table className="vocabulary-table">
            <thead>
                <tr className="vocabulary-table-header">
                    <th className="vocabulary-table-cell">
                        Sources
                    </th>
                    <th className="vocabulary-table-cell">
                        {native}
                    </th>
                    {work
                        .filter(lng => lng !== native)
                        .map(lng => (
                            <th
                                className="vocabulary-table-cell"
                                key={lng}
                            >
                                {lng}
                            </th>
                        ))
                    }
                </tr>
            </thead>
            <tbody>
                {Object.keys(list).map(colorKey => (
                    Object.keys(list[colorKey]).map(idKey => (
                        <VocabularyTableRow key={idKey} vocInPrep={list[colorKey][idKey]} />
                    ))
                ))}
            </tbody>
        </table>
    );
};
