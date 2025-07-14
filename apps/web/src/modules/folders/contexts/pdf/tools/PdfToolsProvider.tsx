import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import { MdBorderColor, MdComment, MdFormatColorFill, MdOutlineMenuBook } from "react-icons/md";
import { useTranslation } from "react-i18next";

import { useContextMenu } from "@/contexts";
import { getRgbColor, getRgbFromString, RgbColor } from "@/utils";

import { ActionItem, CustomCursor, EditorContextMenuItem } from "../../../components";
import {
    DRAWING_TYPES,
    GENRATED_ELEMENTS,
    PDF_TOOLS,
    REFERENCE_TYPES,
    TOOLS_ON_SELECTION,

    ElementAction,
    GenerateElementAction,
    InterractiveReferenceAction,
    PdfNote,
    PdfTool,
    PdfVocabulary,
} from "../../../types";

import { useFoldersManager } from "../../manager";

import { usePdfFile } from "../file";
import { HistoryAction, usePdfHistory } from "../history";

import { PdfToolsContext, PdfToolsContextType } from "./PdfToolsContext";
import { getRange } from "./utils";

const DEFAULT_COLOR: RgbColor = {
    r: .2,
    g: 1,
    b: 0,
};
export const getNoteId = (color: string, index: number | string) => (
    `${Object.values(getRgbFromString(color)).join("-")}-${index}`
);

export const PdfToolsProvider = ({ children }: PropsWithChildren) => {
    const [color, setColor] = useState<RgbColor>(DEFAULT_COLOR);
    /** Text selection range */
    const [currentRange, setCurrentRange] = useState<Range | undefined>(undefined);
    const [customCursor, setCustomCursor] = useState<ReactNode>(null);
    const [tool, setTool] = useState<PdfTool | null>(null);

    const { setContextMenu } = useContextMenu();
    const { selectedFile } = useFoldersManager();
    const { containerRef, pageIndex, pageRef, pdfDoc, setDisplayLoader } = usePdfFile();
    const { pushAction } = usePdfHistory();
    const { t } = useTranslation();

    const { fileInStructure, path: filePath } = selectedFile;
    const pdfFile = fileInStructure!;

    const removeSelection = () => window.getSelection()?.removeAllRanges();
    // ------ HANDLERS ------
    /** Updates the pdf file and clean the tools */
    const handleSelection = async (tool: PdfTool) => {
        if (!pdfDoc || !pageRef.current) {
            return;
        }

        const range = currentRange;
        if (!range) {
            return;
        };

        const pageDimensions = pageRef.current.getBoundingClientRect();

        setDisplayLoader(true);

        const rects = range.getClientRects();
        const rectsArray = Array.from(rects);
        const userAction: ElementAction = {
            type: DRAWING_TYPES.RECTANGLE,
            element: {
                color,
                pageDimensions,
                pageIndex,
                pdfDoc,
                pdfFile,
                rectsArray,
                tool,
            },
        };

        pushAction({ elements: [userAction] });
        setCurrentRange(undefined);
        setDisplayLoader(false);
        removeSelection();
    };
    const handleInteractiveSelection = async (tool: PdfTool) => {
        if (
            !currentRange ||
            (
                tool !== PDF_TOOLS.VOCABULARY &&
                tool !== PDF_TOOLS.NOTE
            ) ||
            !pdfDoc ||
            !pageRef.current
        ) {
            return;
        }

        setDisplayLoader(true);

        const pageDimensions = pageRef.current.getBoundingClientRect();
        const rects = currentRange.getClientRects();
        const rectsArray = Array.from(rects);

        const isNote = tool === PDF_TOOLS.NOTE;
        let colorKey = "";
        let id = "";
        let text = "";
        let element: PdfNote | PdfVocabulary;
        if (isNote) {
            const { y } = rectsArray[0];
            colorKey = getRgbColor(color);
            const noteGroup = pdfFile.elements[pageIndex].notes.filter(elem => elem.color === noteKey);
            text = noteGroup.length > 0
                ? `${noteGroup.length + 1}`
                : "1";
            const occurenceText = currentRange.toString().trim();
            id = getNoteId(colorKey, text);
            element = {
                color: colorKey,
                note: "",
                id,
                occurence: {
                    filePath,
                    pageIndex,
                    text: occurenceText,
                },
                y: y - pageDimensions.top,
            };
        } else {
            const wordToAdd = currentRange.toString().trim();

            id = wordToAdd.split(" ").join("-");
            colorKey = getRgbColor(color);
            text = "*";
            element = {
                color: colorKey,
                id,
                occurence: {
                    filePath,
                    pageIndex,
                    text: wordToAdd,
                },
                translations: {},
            };
        }

        const actionElement = {
            color,
            pageDimensions,
            pageIndex,
            pdfDoc,
            pdfFile,
        };
        const elementAction: ElementAction = {
            type: DRAWING_TYPES.RECTANGLE,
            element: {
                ...actionElement,
                rectsArray,
                tool,
            },
        };
        const textAction: ElementAction = {
            type: DRAWING_TYPES.TEXT,
            element: {
                ...actionElement,
                rect: rectsArray[rectsArray.length - 1],
                text,
            },
        };
        const interractiveText: InterractiveReferenceAction = isNote
            ? {
                type: REFERENCE_TYPES.NOTE,
                element: {
                    ...actionElement,
                    id,
                    rectsArray,
                },
            }
            : {
                type: REFERENCE_TYPES.VOCABULARY,
                element: {
                    ...actionElement,
                    id,
                    rectsArray,
                },
            };
        const generatedElement: GenerateElementAction = isNote
            ? {
                element: element as PdfNote,
                type: GENRATED_ELEMENTS.NOTE,
            }
            : {
                element: element as PdfVocabulary,
                type: GENRATED_ELEMENTS.VOCABULARY,
            };
        const historyAction: HistoryAction = {
            elements: [elementAction, textAction],
            interractiveText,
            elementToGenerate: generatedElement,
        };

        removeSelection();
        pushAction(historyAction);
        setCurrentRange(undefined);
        setTool(null);
        setDisplayLoader(false);
    };

    // Responsible to store the text selection
    useEffect(() => {
        document.addEventListener("selectionchange", () => {
            const range = getRange();

            setCurrentRange(range);
        });

        return () => {
            document.removeEventListener("selectionchange", () => {
                const range = getRange();

                setCurrentRange(range);
            });
        };
    }, []);
    // Handles the stop text selection
    useEffect(() => {
        const handleMouseUp = () => {
            if (
                tool === PDF_TOOLS.UNDERLINE ||
                tool === PDF_TOOLS.HIGHLIGHT
            ) {
                handleSelection(tool);
                return;
            }

            if (
                tool === PDF_TOOLS.NOTE ||
                tool === PDF_TOOLS.VOCABULARY
            ) {
                handleInteractiveSelection(tool);
                return;
            }
        };

        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [color, currentRange, filePath, pdfDoc, pdfFile, tool]);
    // Handles the custom cursor
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { top: containerTop, left: containerLeft } = container.getBoundingClientRect();

            setCustomCursor(
                <CustomCursor
                    color={getRgbColor(color)}
                    position={{ x: e.clientX - containerLeft, y: e.clientY - containerTop }}
                    tool={tool!}
                />
            );
        };

        if (tool) {
            container.style.cursor = "none";
            document.addEventListener("mousemove", handleMouseMove);
        } else {
            container.style.cursor = "auto";
            setCustomCursor(null);
        }

        return () => {
            container.style.cursor = "auto";
            setCustomCursor(null);
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, [color, tool]);

    const actionsRecord: Record<TOOLS_ON_SELECTION, ActionItem> = {
        [TOOLS_ON_SELECTION.UNDERLINE]: {
            icon: <MdBorderColor />,
            onClick: () => handleSelection(PDF_TOOLS.UNDERLINE),
        },
        [TOOLS_ON_SELECTION.HIGHLIGHT]: {
            icon: <MdFormatColorFill />,
            onClick: () => handleSelection(PDF_TOOLS.HIGHLIGHT),
        },
        [TOOLS_ON_SELECTION.NOTE]: {
            icon: <MdComment />,
            onClick: () => handleInteractiveSelection(PDF_TOOLS.NOTE),
        },
        [TOOLS_ON_SELECTION.VOCABULARY]: {
            icon: <MdOutlineMenuBook />,
            onClick: () => handleInteractiveSelection(PDF_TOOLS.VOCABULARY),
        },
    };
    const items = Object.entries(actionsRecord).map(([key, value]) => ({
        children: (
            <EditorContextMenuItem
                actionItem={value}
                tool={key as TOOLS_ON_SELECTION}
                t={t}
            />
        ),
        onClick: value.onClick,
    }));
    // Handles the pdf tools on contextMenu + selectedText
    const onContextMenu = (e: MouseEvent) => {
        if (!currentRange) return;

        e.preventDefault();

        setContextMenu({ x: e.clientX, y: e.clientY }, Object.values(items));
    };
    const onToolSelection = (tool: PdfTool | null) => {
        setTool(tool);

        if (
            tool === PDF_TOOLS.HIGHLIGHT ||
            tool === PDF_TOOLS.UNDERLINE
        ) {
            handleSelection(tool);
        }

        if (
            tool === PDF_TOOLS.NOTE ||
            tool === PDF_TOOLS.VOCABULARY
        ) {
            handleInteractiveSelection(tool);
            return;
        }
    };

    const value: PdfToolsContextType = {
        color,
        currentRange,
        customCursor,
        onContextMenu,
        onToolSelection,
        setColor,
        setTool,
        tool,
    };

    return (
        <PdfToolsContext.Provider value={value}>
            {children}
        </PdfToolsContext.Provider>
    );
};
