import React, { useEffect, useRef, useState } from "react";
import { MdBorderColor, MdComment, MdFormatColorFill, MdOutlineMenuBook } from "react-icons/md";
import { useTranslation } from "react-i18next";

import type { PDFDocumentProxy } from "pdfjs-dist";

import { RgbColor } from "@/components";
import { useContextMenu, useFoldersManager } from "@/contexts";
import { Position } from "@/types";
import { PDFDocument } from "@/workers/pdfConfig";

import { CustomCursor } from "./customCursor";
import { ActionItem, getContextMenuItem, getFileFromPdfDocument, getRange, getRgbColor, PageRefs, STROKE_SIZE, updatePdfDocumentOnSelection, updatePdfDocumentOnStroke } from "./pdfEditor.utils";
import { PDF_TOOLS, PdfEditorToolsState, PdfTool, TOOLS_ON_SELECTION } from "./pdfTools";

export type UsePdfEditorProps = {
    readonly file: File;
};
export const usePdfEditor = (props: UsePdfEditorProps) => {
    /** Text selection range */
    const [currentRange, setCurrentRange] = useState<Range | undefined>(undefined);
    const [customCursor, setCustomCursor] = useState<React.JSX.Element | null>(null);
    /** Used to define the size of the canvas */
    const [isPdfRendered, setIsPdfRendered] = useState(false);
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

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    /**
     * Refs of each page used to display the pdf file
     * Used to know the positions of the interactions
     */
    const pageRefs = useRef<PageRefs>([]);
    const renderedPages = useRef(0);

    const { setContextMenu } = useContextMenu();
    const { files } = useFoldersManager();
    const { t } = useTranslation();

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

    // ------ USE EFFECTS ------
    // Display another file when the props changes
    useEffect(() => {
        setPdfFile(props.file);
    }, [props.file]);
    // Stores the pdf file as a PDFDocument that we will be able to edit
    // And resets all the indicators used to know if the pdf is rendered when pdf file changes
    useEffect(() => {
        renderedPages.current = 0;
        setIsPdfRendered(false);

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
    // Handles the stop text selection
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
    // Handles the brush
    useEffect(() => {
        if (!isPdfRendered) return;

        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!canvas || !container || pdfTools.tool !== PDF_TOOLS.BRUSH) return;

        const pageContainer = container
            .children[1]
            .children[0]
            // Should be targetted page index
            .children[0];

        if (!pageContainer) {
            console.error("Could not reach the page container");
            return;
        }

        const {
            height: pageContainerHeight,
            left: pageContainerLeft,
            top: pageContainerTop,
            width: pageContainerWidth,
        } = pageContainer.getBoundingClientRect();

        canvas.width = pageContainerWidth;
        canvas.height = pageContainerHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let points: Array<Position> = [];
        let isDrawing = false;

        ctx.lineWidth = STROKE_SIZE;
        ctx.strokeStyle = getRgbColor(pdfTools.color);

        const handleMouseDown = (e: MouseEvent) => {
            isDrawing = true;

            ctx.beginPath();
            ctx.moveTo(e.clientX - pageContainerLeft, e.clientY - pageContainerTop);

            points.push({ x: e.clientX, y: e.clientY });
        };
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDrawing) return;

            ctx.lineTo(e.clientX - pageContainerLeft, e.clientY - pageContainerTop);
            ctx.stroke();

            points.push({ x: e.clientX, y: e.clientY });
        };
        const handleMouseUp = async () => {
            if (!pdfDoc || points.length < 2) return;

            updatePdfDocumentOnStroke({
                pageRefs,
                pdfDoc,
                pdfTools,
                points,
            });

            const updatedFile = await getFileFromPdfDocument(pdfDoc, pdfFile);
            files.update(pdfFile, updatedFile);
            setPdfFile(updatedFile);

            points = [];
            isDrawing = false;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };

        container.addEventListener("mousedown", handleMouseDown);
        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseup", handleMouseUp);

        return () => {
            container.removeEventListener("mousedown", handleMouseDown);
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isPdfRendered, pdfDoc, pdfTools, pdfFile]);
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
    const onDocumentLoadSuccess = ({ numPages: nextNumPages }: PDFDocumentProxy): void => {
        setNumPages(nextNumPages);
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
        canvasRef,
        containerRef,
        customCursor,
        numPages,
        onContextMenu,
        onDocumentLoadSuccess,
        onToolSelection,
        pageRefs,
        pdfFile,
        pdfTools,
        renderedPages,
        setColor,
        setIsPdfRendered,
    });
};
