import { useVocabularyTable } from "../../contexts";

import { VocabularyTableHeader } from "./header";
import { VocabularyTableRow } from "./row";
import { VocabularyTableTools } from "./tools";
import "./vocabularyTable.scss";

type VocabularyTableProps = {
	readonly isEditable?: boolean;
};
export const VocabularyTable= ({ isEditable = false }: VocabularyTableProps) => {
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
							isEditable={isEditable}
                            key={`${elem.id}`}
                            pdfVocabulary={elem}
                        />
                    ))}
                </tbody>
            </table>
        </>
    );
};
