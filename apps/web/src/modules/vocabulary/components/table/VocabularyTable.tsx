import { useTranslation } from "react-i18next";

import { useWorkSpaces } from "@/contexts";

import { PreparationVocabulary } from "../../types";

import { VocabularyTableRow } from "./row";
import "./vocabularyTable.scss";

export const VocabularyTable = ({ list }: { list: PreparationVocabulary; }) => {
    const { t } = useTranslation();
    const { currentWorkSpace } = useWorkSpaces();

    const { native, work } = currentWorkSpace!.languages;

    return (
        <table className="vocabulary-table">
            <thead>
                <tr className="vocabulary-table-header">
                    <th className="vocabulary-table-cell head-cell">
                        <p>{t("vocabulary.sources")}</p>
                    </th>
                    <th className="vocabulary-table-cell head-cell">
                        <p>{native}</p>
                    </th>
                    {work
                        .filter(lng => lng !== native)
                        .map(lng => (
                            <th
                                className="vocabulary-table-cell head-cell"
                                key={lng}
                            >
                                <p>{lng}</p>
                            </th>
                        ))
                    }
                </tr>
            </thead>
            <tbody>
                {Object.keys(list).map(colorKey => (
                    Object.keys(list[colorKey]).map((idKey, index) => (
                        <VocabularyTableRow
                            index={index}
                            key={idKey}
                            pdfVocabulary={list[colorKey][idKey]}
                        />
                    ))
                ))}
            </tbody>
        </table>
    );
};
