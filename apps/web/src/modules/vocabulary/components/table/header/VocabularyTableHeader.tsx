import { useState } from "react";
import { FaArrowDownAZ, FaArrowDownZA } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

import { useWorkSpaces } from "@/modules/workspace";

import { SortingState, sortingStateRecord, useVocabularyTable } from "../../../contexts";

import "./vocabularyTableHeader.scss";

type SortingIconProps = {
    readonly columnSortingState: SortingState;
};
const SortingIcon = ({ columnSortingState }: SortingIconProps) => {
    if (columnSortingState === sortingStateRecord[0]) {
        return (null);
    }

    return (
        columnSortingState === sortingStateRecord[1]
            ? (<FaArrowDownAZ />)
            : (<FaArrowDownZA />)
    );
};

type VocabularyTableHeaderCellProps = {
    readonly id: string;
    readonly label: string;
};
const VocabularyTableHeaderCell = ({ id, label }: VocabularyTableHeaderCellProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const { sortingColumn, sortingState, setSortingColumn, toggleSortDirection } = useVocabularyTable();

    const onClick = () => {
        if (sortingColumn !== id) {
            setSortingColumn(id);
        } else {
            toggleSortDirection();
        }
    };

    return (
        <th
            className={`vocabulary-table-cell head-cell ${(sortingColumn === id && sortingState !== "NONE") ? "focused" : ""}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <button onClick={onClick}>
                <span>{label}</span>
                {sortingColumn === id
                    ? (<SortingIcon columnSortingState={sortingState} />)
                    : isHovered && <SortingIcon columnSortingState={sortingStateRecord[1]} />
                }
            </button>
        </th>
    );
};

export const VocabularyTableHeader = () => {
    const { t } = useTranslation();
    const { currentWorkspace } = useWorkSpaces();

    const { languages, nativeLanguage } = currentWorkspace!

    return (
        <thead>
            <tr className="vocabulary-table-header">
                {/** TODO Columns should only be defined once */}
                <VocabularyTableHeaderCell
                    id="sources"
                    label={t("vocabulary.sources")}
                />
                <VocabularyTableHeaderCell
                    id={nativeLanguage}
                    label={nativeLanguage}
                />
                {languages
                    .filter(lng => lng !== nativeLanguage)
                    .map(lng => (
                        <VocabularyTableHeaderCell
                            id={lng}
                            key={lng}
                            label={lng}
                        />
                    ))
                }
            </tr>
        </thead>
    );
};
