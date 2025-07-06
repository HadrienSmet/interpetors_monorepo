import { useMemo } from "react";
import { MdLink } from "react-icons/md";
import { Link } from "react-router-dom";

import { useWorkSpaces } from "@/contexts";
import { useCssVariable } from "@/hooks";
import { PdfVocabulary } from "@/modules/folders";
import { stringToRgba } from "@/utils";

import { useVocabularyTable } from "../../../contexts";

import { CellToFill } from "../cell";

type VocabularyTableRowProps = {
    readonly index: number;
    readonly pdfVocabulary: PdfVocabulary;
};
export const VocabularyTableRow = ({ index, pdfVocabulary }: VocabularyTableRowProps) => {
    const defaultBg = useCssVariable("--clr-txt");
    const { sortingState } = useVocabularyTable();
    const { currentWorkSpace } = useWorkSpaces();

    const { native, work } = currentWorkSpace!.languages;

    const backgroundColor = useMemo(() => {
        if (sortingState !== "NONE") {
            if (index % 2 === 0) {
                return ("transparent");
            }

            return (stringToRgba(defaultBg, .1));
        }

        const opacity = index % 2 === 0
            ? .1
            : .25;

        return (stringToRgba(pdfVocabulary.color, opacity));
    }, [pdfVocabulary.color, index, sortingState]);

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
            <CellToFill
                locale={native}
                pdfVocabulary={pdfVocabulary}
            />
            {work
                .filter(lng => lng !== native)
                .map(lng => (
                    <CellToFill
                        key={`cell-to-fill-${lng}-${pdfVocabulary.occurence.text}`}
                        locale={lng}
                        pdfVocabulary={pdfVocabulary}
                    />
                ))
            }
        </tr>
    );
};
