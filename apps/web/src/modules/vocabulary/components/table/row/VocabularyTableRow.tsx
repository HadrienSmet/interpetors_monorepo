import { useMemo } from "react";
import { MdLink } from "react-icons/md";
import { Link } from "react-router";

import { VocabularyTerm } from "@repo/types";

import { useCssVariable } from "@/hooks";
import { useColorPanel } from "@/modules/colorPanel";
import { useWorkspaces } from "@/modules/workspace";
import { handleCanvasColor, stringToRgba } from "@/utils";

import { useVocabularyTable } from "../../../contexts";

import { CellToFill } from "../cell";

type VocabularyTableRowProps = {
    readonly index: number;
    readonly pdfVocabulary: VocabularyTerm;
};
export const VocabularyTableRow = ({ index, pdfVocabulary }: VocabularyTableRowProps) => {
    const { colorPanel } = useColorPanel();
    const defaultBg = useCssVariable("--clr-txt");
    const { sortingState } = useVocabularyTable();
    const { currentWorkspace } = useWorkspaces();

    const { languages, nativeLanguage } = currentWorkspace!;

    const vocColor = useMemo(() => (handleCanvasColor(pdfVocabulary.color, colorPanel)), [pdfVocabulary.color, colorPanel]);
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

        return (stringToRgba(vocColor, opacity));
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
                locale={nativeLanguage}
                localeIndex={0}
                pdfVocabulary={pdfVocabulary}
            />
            {languages
                .filter(lng => lng !== nativeLanguage)
                .map(lng => (
                    <CellToFill
                        key={`cell-to-fill-${lng}-${pdfVocabulary.occurence.text}`}
                        locale={lng}
                        localeIndex={currentWorkspace!.languages
                            .filter(lng => lng !== nativeLanguage)
                            .findIndex(el => el === lng) + 1}
                        pdfVocabulary={pdfVocabulary}
                    />
                ))
            }
        </tr>
    );
};
