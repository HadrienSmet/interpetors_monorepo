import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import { MdBorderColor, MdComment, MdFormatColorFill, MdOutlineMenuBook } from "react-icons/md";
import { useTranslation } from "react-i18next";

import { getNoteId, useContextMenu, useNotes } from "@/contexts";
import { getRgbColor, RgbColor } from "@/utils";

import { ActionItem, CustomCursor, EditorContextMenuItem } from "../../../components";
import { PDF_TOOLS, TOOLS_ON_SELECTION } from "../../../types";

import { useFoldersManager } from "../../manager";

import { usePdfFile } from "../file";
import { HistoryAction, usePdfHistory } from "../history";
import { DRAWING_TYPES, ElementAction, REFERENCE_TYPES, ReferenceAction } from "../types";

import { PdfTool, PdfToolsContext, PdfToolsContextType } from "./PdfToolsContext";
import { getNoteFromRange, getRange } from "./utils";

const DEFAULT_COLOR: RgbColor = {
    r: .2,
    g: 1,
    b: 0,
};
export const PdfToolsProvider = ({ children }: PropsWithChildren) => {
    const [color, setColor] = useState<RgbColor>(DEFAULT_COLOR);
    /** Text selection range */
    const [currentRange, setCurrentRange] = useState<Range | undefined>(undefined);
    const [customCursor, setCustomCursor] = useState<ReactNode>(null);
    const [tool, setTool] = useState<PdfTool | null>(null);

    const { setContextMenu } = useContextMenu();
    const { selectedFile } = useFoldersManager();
    const { createNote, notes } = useNotes();
    const { containerRef, pageIndex, pageRef, pageRefs, pdfDoc, setDisplayLoader } = usePdfFile();
    const { pushAction } = usePdfHistory();
    const { t } = useTranslation();

    const { fileInStructure, path: filePath } = selectedFile;
    const pdfFile = fileInStructure!;

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
        setDisplayLoader(false);
    };
    const handleTextReference = async (tool: PdfTool, filePath: string) => {
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
        const note = getNoteFromRange({
            color: noteKey,
            file: pdfFile.file,
            filePath,
            range: currentRange,
        });
        if(!note) {
            console.error("An error occured during the note creation");
            setDisplayLoader(false);
            return;
        }

        createNote(note);

        const noteIndex = noteKey in notes
            ? `${Object.keys(notes[noteKey]).length}`
            : "1";
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
                text: noteIndex,
            },
        };
        const actionReference: ReferenceAction = {
            type: REFERENCE_TYPES.NOTE,
            element: {
                color,
                noteId: getNoteId(noteKey, noteIndex),
                pageRefs,
                pdfDoc,
                pdfFile,
                rectsArray,
            },
        };
        const historyAction: HistoryAction = {
            elements: [elementAction, textAction],
            reference: actionReference,
        };

        pushAction(historyAction);
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
                handleTextReference(tool, filePath);
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
            onClick: () => handleTextReference(PDF_TOOLS.NOTE, filePath),
        },
        [TOOLS_ON_SELECTION.VOCABULARY]: {
            icon: <MdOutlineMenuBook />,
            onClick: () => console.log("vocabulary"),
        },
    };
    const items = Object.entries(actionsRecord).map(([key, value]) => ({
        children: (
            <EditorContextMenuItem
                actionItem={value}
                tool={key as TOOLS_ON_SELECTION}
                t={t}
            />
        ) ,
        onClick: value.onClick,
    }));
    // Handles the pdf tools on contextMenu + selectedText
    const onContextMenu = (e: MouseEvent) => {
        if (!currentRange) return;

        const pageRef = pageRefs.current.find(ref => {
            if (!ref) return (false);

            const { top, bottom, left, right } = ref.getBoundingClientRect();

            return (
                e.clientX >= left &&
                e.clientX <= right &&
                e.clientY >= top &&
                e.clientY <= bottom
            );
        });

        if (!pageRef) return; // Default context menu

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
            handleTextReference(tool, filePath);
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
