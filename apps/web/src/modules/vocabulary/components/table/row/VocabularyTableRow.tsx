import { useMemo } from "react";
import { MdLink } from "react-icons/md";
import { Link } from "react-router-dom";

import { useWorkSpaces } from "@/contexts";
import { PdfVocabulary } from "@/modules/folders";
import { stringToRgba } from "@/utils";


import { CellToFill } from "../cell";

type VocabularyTableRowProps = {
    readonly index: number;
    readonly pdfVocabulary: PdfVocabulary;
};
export const VocabularyTableRow = ({ index, pdfVocabulary }: VocabularyTableRowProps) => {
    const { currentWorkSpace } = useWorkSpaces();

    const { work } = currentWorkSpace!.languages;

    const backgroundColor = useMemo(() => {
        const opacity = index % 2 === 0
            ? .1
            : .25;

        return (stringToRgba(pdfVocabulary.color, opacity));
    }, [pdfVocabulary.color, index])

    return (
        <tr
            className="vocabulary-table-row"
            style={{ backgroundColor }}
        >
            <td className="vocabulary-table-cell">
                <Link to={`/prepare/files?filepath=${pdfVocabulary.occurence.filePath}`}>
                    <MdLink />
                    <em>{pdfVocabulary.occurence.text}</em>
                </Link>
            </td>
            {work.map(lng => (
                <CellToFill
                    key={`cell-to-fill-${lng}-${pdfVocabulary.occurence.text}`}
                    locale={lng}
                    pdfVocabulary={pdfVocabulary}
                />
            ))}
        </tr>
    );
};
