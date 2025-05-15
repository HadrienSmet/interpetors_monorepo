import React, { useEffect, useRef, useState } from "react";
import { MdBorderColor, MdBrush, MdComment, MdFormatColorFill, MdOutlineMenuBook } from "react-icons/md";
import { useTranslation } from "react-i18next";

import type { PDFDocumentProxy } from "pdfjs-dist";

import { RgbColor } from "@/components";
import { useContextMenu, useFoldersManager } from "@/contexts";
import { PDFDocument } from "@/workers/pdfConfig";

import { ActionItem, getContextMenuItem, getRange, getRgbColor, PageRefs, updatePdfPage } from "./pdfEditor.utils";
import { PDF_TOOLS, PdfEditorToolsState, PdfTool, TOOLS_ON_SELECTION } from "./pdfTools";

type PDFFile = File;
export type UsePdfEditorProps = {
    readonly file: PDFFile;
};

const CURSOR_SIZE = 24 as const;
const TOOLS_ICONS = {
    [PDF_TOOLS.BRUSH]: (color: string, style: React.CSSProperties) => <MdBrush color={color} style={style} />,
    [PDF_TOOLS.HIGHLIGHT]: (color: string, style: React.CSSProperties) => <MdFormatColorFill color={color} style={style} />,
    [PDF_TOOLS.NOTE]: (color: string, style: React.CSSProperties) => <MdComment color={color} style={style} />,
    [PDF_TOOLS.UNDERLINE]: (color: string, style: React.CSSProperties) => <MdBorderColor color={color} style={style} />,
    [PDF_TOOLS.VOCABULARY]: (color: string, style: React.CSSProperties) => <MdOutlineMenuBook color={color} style={style} />,
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
    const [pdfFile, setPdfFile] = useState<PDFFile>(props.file);
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
    const handleUnderline = async () => {
        if (!pdfDoc) {
            return;
        }

        const range = currentRange;
        if (!range) {
            return;
        };

        const rects = range.getClientRects();

        Array.from(rects).forEach(rect => updatePdfPage({ pageRefs, pdfDoc, pdfTools, rect }));

        const updatedBytes = await pdfDoc.save();

        const updatedBlob = new Blob([updatedBytes], { type: "application/pdf" });
        const updatedFile = new File([updatedBlob], pdfFile.name, { type: "application/pdf" });

        files.update(pdfFile, updatedFile);

        setPdfFile(updatedFile);
        setCurrentRange(undefined);
        setTool(null);
    };

    const actionsRecord: Record<TOOLS_ON_SELECTION, ActionItem> = {
        [TOOLS_ON_SELECTION.UNDERLINE]: {
            icon: <MdBorderColor />,
            onClick: () => handleUnderline(),
        },
        [TOOLS_ON_SELECTION.HIGHLIGHT]: {
            icon: <MdFormatColorFill />,
            onClick: () => console.log("highlight"),
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
            if (pdfTools.tool === PDF_TOOLS.UNDERLINE) {
                handleUnderline();
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
            const toolIcon = TOOLS_ICONS[pdfTools.tool!];
            setCustomCursor(
                toolIcon(
                    getRgbColor(pdfTools.color),
                    {
                        height: CURSOR_SIZE,
                        left: e.clientX - containerLeft,
                        position: "absolute",
                        top: e.clientY - containerTop - CURSOR_SIZE,
                        width: CURSOR_SIZE,
                    }
                )
            );
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
        onClick: value.onClick
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
        if (tool === PDF_TOOLS.UNDERLINE) {
            handleUnderline();
        }

        setTool(tool);
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
