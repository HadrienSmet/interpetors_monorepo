import { AddTranslationParams, useVocabularyTable } from "../../contexts";

import { VocabularyTableHeader } from "./header";
import { VocabularyTableRow } from "./row";
import { VocabularyTableTools } from "./tools";
import "./vocabularyTable.scss";

type VocabularyTableProps = {
    readonly addTranslation: (params: AddTranslationParams) => void;
};
export const VocabularyTable= ({ addTranslation }: VocabularyTableProps) => {
    const { list } = useVocabularyTable();

    return (
        <>
            <VocabularyTableTools />
            <table className="vocabulary-table">
                <VocabularyTableHeader />
                <tbody>
                    {list.map((elem, index) => (
                        <VocabularyTableRow
                            addTranslation={addTranslation}
                            index={index}
                            key={`${elem.id}`}
                            pdfVocabulary={elem}
                        />
                    ))}
                </tbody>
            </table>
        </>
    );
};
