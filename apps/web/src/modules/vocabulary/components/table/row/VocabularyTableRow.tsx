import { useMemo } from "react";
import { MdLink } from "react-icons/md";
import { useSearchParams } from "react-router";

import { VocabularyTerm } from "@repo/types";

import { useCssVariable } from "@/hooks";
import { useColorPanel } from "@/modules/colorPanel";
import { useWorkspaces } from "@/modules/workspace";
import { getRgbColor, handleActionColor, stringToRgba, URL_PARAMETERS, URL_VIEWS } from "@/utils";

import { useVocabularyTable } from "../../../contexts";

import { CellToFill } from "../cell";

import "./vocabularyTableRow.scss";

type VocabularyTableRowProps = {
	readonly index: number;
	readonly isEditable: boolean;
    readonly pdfVocabulary: VocabularyTerm;
};
export const VocabularyTableRow = ({ index, isEditable, pdfVocabulary }: VocabularyTableRowProps) => {
    const { colorPanel } = useColorPanel();
    const defaultBg = useCssVariable("--clr-txt");
    const [_, setSearchParams] = useSearchParams();
    const { sortingState } = useVocabularyTable();
    const { currentWorkspace } = useWorkspaces();

    const { languages, nativeLanguage } = currentWorkspace!;

    const vocColor = useMemo(() => (
        handleActionColor(pdfVocabulary.color, colorPanel)
    ), [pdfVocabulary.color, colorPanel]);
    const vocColorStr = getRgbColor(vocColor);
    const backgroundColor = useMemo(() => {
        if (sortingState !== "NONE") {
            if (index % 2 === 0) return ("transparent");

            return (stringToRgba(defaultBg, .1));
        }

        const opacity = index % 2 === 0
            ? .1
            : .25;

        return (stringToRgba(vocColorStr, opacity));
    }, [pdfVocabulary.color, index, sortingState]);

    const toFile = () => setSearchParams(prev => {
        const next = new URLSearchParams(prev);

        next.delete(URL_PARAMETERS.term);
        next.set(URL_PARAMETERS.view, URL_VIEWS.folders);
        next.set(URL_PARAMETERS.filepath, pdfVocabulary.occurrence.filePath);
        next.set(URL_PARAMETERS.pageIndex, pdfVocabulary.occurrence.pageIndex.toString());

        return (next);
    });

    return (
        <tr
            className="vocabulary-table-row"
            style={{ backgroundColor }}
        >
            <td className="vocabulary-table-cell">
                <button
                    className="vocabulary-table__link"
                    onClick={toFile}
                    style={{ maxWidth: "100%" }}
                    title={pdfVocabulary.occurrence.text}
                >
                    <MdLink />
                    <em>{pdfVocabulary.occurrence.text}</em>
                </button>
            </td>
            <CellToFill
				isEditable={isEditable}
                locale={nativeLanguage}
                pdfVocabulary={pdfVocabulary}
            />
            {languages
                .filter(lng => lng !== nativeLanguage)
                .map(lng => (
                    <CellToFill
						isEditable={isEditable}
                        key={`cell-to-fill-${lng}-${pdfVocabulary.occurrence.text}`}
                        locale={lng}
                        pdfVocabulary={pdfVocabulary}
                    />
                ))
            }
        </tr>
    );
};
