import React, { useEffect, useRef, useState } from "react";
import { MdBorderColor, MdComment, MdFormatColorFill, MdOutlineMenuBook } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import type { PDFDocumentProxy } from "pdfjs-dist";

import {
    FileInStructure,
    getNoteId,
    NoteInStructure,
    PathToDraw,
    RectangleToDraw,
    TextToDraw,
    useContextMenu,
    useFoldersManager,
    useNotes,
} from "@/contexts";
import { Position } from "@/types";
import { getRgbColor, RgbColor } from "@/utils";
import { PDFDocument } from "@/workers/pdfConfig";

import { ActionItem, ContextMenuItem } from "./contextMenuItem";
import { CustomCursor } from "./customCursor";
import { PDF_TOOLS, PdfEditorToolsState, PdfTool, TOOLS_ON_SELECTION } from "./pdfTools";
import {
    getFileFromPdfDocument,
    getNoteFromRange,
    getRange,
    PageRefs,
    STROKE_SIZE,
    updatePdfDocumentOnSelection,
    updatePdfDocumentOnStroke,
} from "./utils";

export type UsePdfEditorProps = {
    readonly fileInStructure: FileInStructure;
    readonly path: string;
};
type HandleFileUpdateParams = {
    file: FileInStructure;
    newNoteReferences?: Array<NoteInStructure>;
    newRectanglesToDraw?: Array<RectangleToDraw>;
    newTextsToDraw?: Array<TextToDraw>;
    newPathsToDraw?: Array<PathToDraw>;
};
export const usePdfEditor = (props: UsePdfEditorProps) => {
    /** Text selection range */
    const [currentRange, setCurrentRange] = useState<Range | undefined>(undefined);
    const [customCursor, setCustomCursor] = useState<React.JSX.Element | null>(null);
    const [displayLoader, setDisplayLoader] = useState(true);
    /** Used to define the size of the canvas */
    const [isPdfRendered, setIsPdfRendered] = useState(false);
    /** Number of pages of the pdf file */
    const [numPages, setNumPages] = useState<number>();
    /** Pdf document - Used to interact with the binary */
    const [pdfDoc, setPdfDoc] = useState<PDFDocument>();
    /** Pdf file - Used to display the pdf file */
    const [pdfFile, setPdfFile] = useState<FileInStructure>(props.fileInStructure);
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
    const navigate = useNavigate();
    const { createNote, notes } = useNotes();
    const { t } = useTranslation();

    const setColor = (color: RgbColor) => setPdfTools(state => ({ ...state, color }));
    const setTool = (tool: PdfTool | null) => setPdfTools(state => ({ ...state, tool }));

    const handleFileUpdate = (params: HandleFileUpdateParams) => {
        const {
            file,
            newNoteReferences,
            newRectanglesToDraw,
            newPathsToDraw,
            newTextsToDraw,
        } = params;

        files.update({
            old: pdfFile,
            newFile: file,
            noteReferences: newNoteReferences,
            pathsToDraw: newPathsToDraw,
            rectanglesToDraw: newRectanglesToDraw,
            textsToDraw: newTextsToDraw,
        });

        setPdfFile(file);
        setCurrentRange(undefined);
        setTool(null);
    };
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
        setDisplayLoader(true);

        const rects = range.getClientRects();

        const updateouput = Array.from(rects).map(rect => updatePdfDocumentOnSelection({
            pageRefs,
            pdfDoc,
            pdfTools: {
                color: pdfTools.color,
                tool,
            },
            rect,
        })).filter(el => el !== undefined);

        const updatedFile = await getFileFromPdfDocument(pdfDoc, pdfFile);

        handleFileUpdate({
            file: updatedFile,
            newRectanglesToDraw: updateouput.map((el) => el?.rectangleToDraw )
        });
    };
    const handleTextReference = async (tool: PdfTool) => {
        if (!currentRange || tool !== PDF_TOOLS.NOTE || !pdfDoc) {
            return;
        }

        setDisplayLoader(true);

        const noteKey = getRgbColor(pdfTools.color);
        const note = getNoteFromRange({
            color: noteKey,
            file: pdfFile.file,
            filePath: props.path,
            range: currentRange,
        });

        if (!note) {
            console.error("An error occured during the note creation");
            setDisplayLoader(false);
            return;
        }

        createNote(note);

        const noteIndex = noteKey in notes
            ? `${Object.keys(notes[noteKey]).length}`
            : "1";

        const rects = currentRange.getClientRects();
        const newNoteReferences: Array<NoteInStructure> = [];
        const newRectanglesToDraw: Array<RectangleToDraw> = [];
        const newTextsToDraw: Array<TextToDraw> = [];
        let index = 0;
        const rectsArr = Array.from(rects);

        for (const rect of rectsArr) {
            const output = updatePdfDocumentOnSelection({
                noteId: getNoteId(noteKey, noteIndex),
                pageRefs,
                pdfDoc,
                pdfTools: { ...pdfTools, tool },
                rect,
                refToAdd: index === rectsArr.length - 1
                    ? noteIndex
                    : undefined,
            });

            if (!output) {
                index++;
                continue;
            }

            if (output.noteReference) {
                newNoteReferences.push(output.noteReference);
            }
            if (output.textToDraw) {
                newTextsToDraw.push(output.textToDraw);
            }

            newRectanglesToDraw.push(output.rectangleToDraw);

            index++;
        }

        const updatedFile = await getFileFromPdfDocument(pdfDoc, pdfFile);
        handleFileUpdate({
            file: updatedFile,
            newNoteReferences,
            newRectanglesToDraw,
            newTextsToDraw,
        });

        setTimeout(() => {
            navigate("/prepare/notes");
        }, 700);
    };

    // ------ USE EFFECTS ------
    // Display another file when the props changes
    useEffect(() => {
        setPdfFile(props.fileInStructure);
    }, [props.fileInStructure]);
    // Removes the loader when the pdf is displayed
    useEffect(() => {
        if (isPdfRendered) {
            setTimeout(() => {
                setDisplayLoader(false);
            }, 500);
        }
    }, [isPdfRendered]);
    // Stores the pdf file as a PDFDocument that we will be able to edit
    // And resets all the indicators used to know if the pdf is rendered when pdf file changes
    useEffect(() => {
        renderedPages.current = 0;
        setIsPdfRendered(false);

        const loadPdf = async () => {
            if (!pdfFile) return;

            const arrayBuffer = typeof pdfFile === "string"
                ? await fetch(pdfFile).then(res => res.arrayBuffer())
                : await pdfFile.file.arrayBuffer();

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
                return;
            }

            if (pdfTools.tool === PDF_TOOLS.NOTE) {
                handleTextReference(pdfTools.tool);
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
            setDisplayLoader(true);

            const pathToDraw = updatePdfDocumentOnStroke({
                pageRefs,
                pdfDoc,
                pdfTools,
                points,
            });

            if (!pathToDraw) {
                setDisplayLoader(false);
                return;
            };

            const updatedFile = await getFileFromPdfDocument(pdfDoc, pdfFile);
            files.update({
                old: pdfFile,
                newFile: updatedFile,
                pathsToDraw: [pathToDraw]
            })
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
            onClick: () => handleTextReference(PDF_TOOLS.NOTE),
        },
        [TOOLS_ON_SELECTION.VOCABULARY]: {
            icon: <MdOutlineMenuBook />,
            onClick: () => console.log("vocabulary"),
        },
    };
    const items = Object.entries(actionsRecord).map(([key, value]) => ({
        children: (
            <ContextMenuItem
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

        if (tool === PDF_TOOLS.NOTE) {
            handleTextReference(tool);
        }
    };

    return ({
        canvasRef,
        containerRef,
        customCursor,
        displayLoader,
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
