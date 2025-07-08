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
    const handleNoteReference = async (tool: PdfTool) => {
        if (
            !currentRange ||
            tool !== PDF_TOOLS.NOTE ||
            !pdfDoc ||
            !pageRef.current
        ) {
            return;
        }

        setDisplayLoader(true);

        const noteKey = getRgbColor(color);
        const noteGroup = pdfFile.elements[pageIndex].notes.filter(elem => elem.color === noteKey);
        const noteIndex = noteGroup.length > 0
            ? `${noteGroup.length + 1}`
            : "1";

        const text = currentRange.toString().trim();

        const rects = currentRange.getClientRects();
        const rectsArray = Array.from(rects);

        const { y } = rectsArray[0];

        if (!text) return;

        const noteId = getNoteId(noteKey, noteIndex);
        const pageDimensions = pageRef.current.getBoundingClientRect();

        const pdfNote: PdfNote = {
            color: noteKey,
            note: "",
            id: noteId,
            occurence: {
                filePath,
                pageIndex,
                text,
            },
            y: y - pageDimensions.top,
        };
        if (!pdfNote) {
            console.error("An error occured during the note creation");
            setDisplayLoader(false);
            return;
        }

        const elementAction: ElementAction = {
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
        const textAction: ElementAction = {
            type: DRAWING_TYPES.TEXT,
            element: {
                color,
                pageDimensions,
                pageIndex,
                pdfDoc,
                pdfFile,
                rect: rectsArray[rectsArray.length - 1],
                text: noteIndex,
            },
        };
        const actionReference: InterractiveReferenceAction = {
            type: REFERENCE_TYPES.NOTE,
            element: {
                color,
                noteId,
                pageDimensions,
                pageIndex,
                pdfDoc,
                pdfFile,
                rectsArray,
            },
        };
        const generateNoteAction: GenerateElementAction = {
            element: pdfNote,
            type: GENRATED_ELEMENTS.NOTE,
        };
        const historyAction: HistoryAction = {
            elements: [elementAction, textAction],
            interractiveText: actionReference,
            elementToGenerate: generateNoteAction,
        };

        removeSelection();
        pushAction(historyAction);
        setCurrentRange(undefined);
        setTool(null);
        setDisplayLoader(false);
    };
    const handleVocabularyReference = async (tool: PdfTool) => {
        if (
            !currentRange ||
            tool !== PDF_TOOLS.VOCABULARY ||
            !pdfDoc ||
            !pageRef.current
        ) {
            return;
        }

        setDisplayLoader(true);

        const wordToAdd = currentRange.toString().trim();
        const vocId = wordToAdd.split(" ").join("-");
        const vocKey = getRgbColor(color);

        const pageDimensions = pageRef.current.getBoundingClientRect();
        const rects = currentRange.getClientRects();
        const rectsArray = Array.from(rects);
        const elementAction: ElementAction = {
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
        const textAction: ElementAction = {
            type: DRAWING_TYPES.TEXT,
            element: {
                color,
                pageDimensions,
                pageIndex,
                pdfDoc,
                pdfFile,
                rect: rectsArray[rectsArray.length - 1],
                text: "*",
            },
        };
        const interractiveText: InterractiveReferenceAction = {
            type: REFERENCE_TYPES.VOCABULARY,
            element: {
                color,
                id: vocId,
                pageDimensions,
                pageIndex,
                pdfDoc,
                pdfFile,
                rectsArray,
            },
        };
        const generateVocabularyAction: GenerateElementAction = {
            type: GENRATED_ELEMENTS.VOCABULARY,
            element: {
                color: vocKey,
                id: vocId,
                occurence: {
                    filePath,
                    pageIndex,
                    text: wordToAdd,
                },
                translations: {},
            },
        };
        const historyAction: HistoryAction = {
            elements: [elementAction, textAction],
            interractiveText,
            elementToGenerate: generateVocabularyAction,
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

            if (tool === PDF_TOOLS.NOTE) {
                handleNoteReference(tool);
            }
            if (tool === PDF_TOOLS.VOCABULARY) {
                handleVocabularyReference(tool);
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
            onClick: () => handleNoteReference(PDF_TOOLS.NOTE),
        },
        [TOOLS_ON_SELECTION.VOCABULARY]: {
            icon: <MdOutlineMenuBook />,
            onClick: () => handleVocabularyReference(PDF_TOOLS.VOCABULARY),
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

        if (tool === PDF_TOOLS.NOTE) {
            handleNoteReference(tool);
        }
        if (tool === PDF_TOOLS.VOCABULARY) {
            handleVocabularyReference(tool);
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
