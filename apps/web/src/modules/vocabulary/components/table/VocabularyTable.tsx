import { useVocabularyTable } from "../../contexts";

import { VocabularyTableHeader } from "./header";
import { VocabularyTableRow } from "./row";
import { VocabularyTableTools } from "./tools";
import "./vocabularyTable.scss";

export const VocabularyTable= () => {
    const { list } = useVocabularyTable();

    return (
        <>
            <VocabularyTableTools />
            <table className="vocabulary-table">
                <VocabularyTableHeader />
                <tbody>
                    {list.map((elem, index) => (
                        <VocabularyTableRow
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
