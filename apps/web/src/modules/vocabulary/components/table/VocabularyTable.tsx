import { useVocabularyTable, VocabularyTableProvider } from "../../contexts";

import { VocabularyTableHeader } from "./header";
import { VocabularyTableRow } from "./row";
import { VocabularyTableTools } from "./tools";
import "./vocabularyTable.scss";

const VocabularyTableChild = () => {
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
export const VocabularyTable = () => (
    <VocabularyTableProvider>
        <VocabularyTableChild />
    </VocabularyTableProvider>
);
