import React, { useEffect, useRef, useState } from "react";
import { MdBorderColor, MdComment, MdFormatColorFill, MdOutlineMenuBook } from "react-icons/md";
import { useTranslation } from "react-i18next";

import type { PDFDocumentProxy } from "pdfjs-dist";

import { RgbColor } from "@/components";
import { useContextMenu, useFoldersManager } from "@/contexts";
import { PDFDocument } from "@/workers/pdfConfig";

import { CustomCursor } from "./customCursor";
import { ActionItem, getContextMenuItem, getFileFromPdfDocument, getRange, getRgbColor, PageRefs, updatePdfDocumentOnSelection } from "./pdfEditor.utils";
import { PDF_TOOLS, PdfEditorToolsState, PdfTool, TOOLS_ON_SELECTION } from "./pdfTools";

export type UsePdfEditorProps = {
    readonly file: File;
};
export const usePdfEditor = (props: UsePdfEditorProps) => {
    /** Text selection range */
    const [currentRange, setCurrentRange] = useState<Range | undefined>(undefined);
    const [customCursor, setCustomCursor] = useState<React.JSX.Element | null>(null);
    /** Number of pages of the pdf file */
    const [numPages, setNumPages] = useState<number>();
    /** Pdf document - Used to interact with the binary */
    const [pdfDoc, setPdfDoc] = useState<PDFDocument>();
    /** Pdf file - Used to display the pdf file */
    const [pdfFile, setPdfFile] = useState<File>(props.file);
    /** State to interact with the pdf file */
    const [pdfTools, setPdfTools] = useState<PdfEditorToolsState>({
        tool: null,
        color: {
            r: 0.2,
            g: 1,
            b: 0,
        },
    });

    /**
     * Refs of each page used to display the pdf file
     * Used to know the positions of the interactions
     * */
    const pageRefs = useRef<PageRefs>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const { setContextMenu } = useContextMenu();
    const { files } = useFoldersManager();
    const { t } = useTranslation();

    const onDocumentLoadSuccess = ({ numPages: nextNumPages }: PDFDocumentProxy): void => {
        setNumPages(nextNumPages);
    };
    const setColor = (color: RgbColor) => setPdfTools(state => ({ ...state, color }));
    const setTool = (tool: PdfTool | null) => setPdfTools(state => ({ ...state, tool }));

    // ------ HANDLERS ------
    /** Updates the pdf file and clean the tools */
    const handleSelection = async (tool: PdfTool) => {
        if (!pdfDoc) {
            return;
        }

        const range = currentRange;
        if (!range) {
            return;
        };

        const rects = range.getClientRects();

        Array.from(rects).forEach(rect => updatePdfDocumentOnSelection({
            pageRefs,
            pdfDoc,
            pdfTools: {
                color: pdfTools.color,
                tool,
            },
            rect,
        }));

        const updatedFile = await getFileFromPdfDocument(pdfDoc, pdfFile);

        files.update(pdfFile, updatedFile);

        setPdfFile(updatedFile);
        setCurrentRange(undefined);
        setTool(null);
    };

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
            onClick: () => console.log("note"),
        },
        [TOOLS_ON_SELECTION.VOCABULARY]: {
            icon: <MdOutlineMenuBook />,
            onClick: () => console.log("vocabulary"),
        },
    };

    // ------ USE EFFECTS ------
    /** Display another file when the props changes */
    useEffect(() => {
        setPdfFile(props.file);
    }, [props.file]);
    // Stores the pdf file as a PDFDocument that we will be able to edit
    useEffect(() => {
        const loadPdf = async () => {
            if (!pdfFile) return;

            const arrayBuffer = typeof pdfFile === "string"
                ? await fetch(pdfFile).then(res => res.arrayBuffer())
                : await pdfFile.arrayBuffer();

            const pdfDoc = await PDFDocument.load(arrayBuffer);
            setPdfDoc(pdfDoc);
        };

        loadPdf();
    }, [pdfFile]);
    // Responsible to store the text selection
    useEffect(() => {
        document.addEventListener("selectionchange", () => {
            const range = getRange();

            if (range) {
                setCurrentRange(range);
            }
        });

        return () => {
            document.removeEventListener("selectionchange", () => {
                const range = getRange();

                if (range) {
                    setCurrentRange(range);
                }
            });
        };
    }, []);
    // Handles the pdf tools on mouse up (when the user stop selecting text)
    useEffect(() => {
        const handleMouseUp = () => {
            if (
                pdfTools.tool === PDF_TOOLS.UNDERLINE ||
                pdfTools.tool === PDF_TOOLS.HIGHLIGHT
            ) {
                handleSelection(pdfTools.tool);
            }
        };

        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [currentRange, pdfTools, pdfDoc]);
    // Handles the custom cursor
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { top: containerTop, left: containerLeft } = container.getBoundingClientRect();

            setCustomCursor(CustomCursor({
                color: getRgbColor(pdfTools.color),
                position: { x: e.clientX - containerLeft, y: e.clientY - containerTop },
                tool: pdfTools.tool!,
            }))
        };

        if (pdfTools.tool) {
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
    }, [pdfTools.tool, pdfTools.color]);

    const items = Object.entries(actionsRecord).map(([key, value]) => ({
        children: getContextMenuItem(key as TOOLS_ON_SELECTION, value, t),
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
    };

    return ({
        containerRef,
        customCursor,
        numPages,
        onContextMenu,
        onDocumentLoadSuccess,
        onToolSelection,
        pageRefs,
        pdfFile,
        pdfTools,
        setColor,
    });
};
