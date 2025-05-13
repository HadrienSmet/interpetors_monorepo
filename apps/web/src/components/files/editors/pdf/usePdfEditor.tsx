import { useEffect, useRef, useState } from "react";
import { MdBorderColor, MdComment, MdFormatColorFill, MdOutlineMenuBook } from "react-icons/md";
import { useTranslation } from "react-i18next";

import type { PDFDocumentProxy } from "pdfjs-dist";
import { rgb } from "pdf-lib";

import { RgbColor } from "@/components";
import { useContextMenu } from "@/contexts";
import { PDFDocument } from "@/workers/pdfConfig";

import { PDF_TOOLS, PdfEditorToolsState } from "./pdfTools";

type PDFFile = string | File | null;

export type UsePdfEditorProps = {
    readonly file: PDFFile;
};

const getRange = () => {
    const selection = document.getSelection();
    if (!selection || selection.isCollapsed) {
        return;
    };

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText.trim()) {
        return;
    }

    return (range);
};
export const usePdfEditor = (props: UsePdfEditorProps) => {
    /** Text selection range */
    const [currentRange, setCurrentRange] = useState<Range | undefined>(undefined);
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
    const pageRefs = useRef<(HTMLCanvasElement | undefined)[]>([]);

    const { setContextMenu } = useContextMenu();
    const { t } = useTranslation();

    const onDocumentLoadSuccess = ({ numPages: nextNumPages }: PDFDocumentProxy): void => {
        setNumPages(nextNumPages);
    };
    const setColor = (color: RgbColor) => setPdfTools(state => ({ ...state, color }));
    const setTool = (tool: PDF_TOOLS | null) => setPdfTools(state => ({ ...state, tool }));

    const handleUnderline = async () => {
        if (!pdfDoc || pdfTools.tool !== PDF_TOOLS.UNDERLINE) {
            return;
        }

        const range = currentRange;
        if (!range) {
            return;
        };

        const rects = range.getClientRects();

        Array.from(rects).forEach(rect => {
            const pageRef = pageRefs.current.find(ref => {
                if (!ref) return false;
                const { top, bottom } = ref.getBoundingClientRect();

                return (
                    rect.top >= top &&
                    rect.bottom <= bottom
                );
            });

            if (!pageRef) return;

            const pageIndex = pageRefs.current.indexOf(pageRef);
            const page = pdfDoc.getPage(pageIndex);
            const { width: pdfWidth, height: pdfHeight } = page.getSize();

            // Getting the scale of the page
            const scaleFactor = pageRef.clientWidth / pdfWidth;

            const x = (rect.left - pageRef.getBoundingClientRect().left) / scaleFactor;
            const y = pdfHeight - ((rect.bottom - pageRef.getBoundingClientRect().top) / scaleFactor);

            page.drawRectangle({
                x,
                y,
                width: rect.width / scaleFactor,
                height: 2,
                color: rgb(pdfTools.color.r, pdfTools.color.g, pdfTools.color.b),
            });
        });

        const updatedBytes = await pdfDoc.save();
        const updatedBlob = new Blob([updatedBytes], { type: "application/pdf" });
        const updatedFile = new File([updatedBlob], "modified.pdf", { type: "application/pdf" });

        setPdfFile(updatedFile);
        setTool(null);
    };

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

    /** Handles the interactions when a text is already selected and the user picked a tool */
    useEffect(() => {
        if (
            pdfTools.tool === PDF_TOOLS.UNDERLINE &&
            currentRange
        ) {
            handleUnderline();
        }
    }, [pdfDoc, pdfTools, currentRange]);
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
    }, [pdfTools, pdfDoc]);

    const items = [
        {
            children: (
                <>
                    <MdBorderColor />
                    <p>{t("views.new.context-menu.editor.underline")}</p>
                </>
            ),
            onClick: () => {
                setTool(PDF_TOOLS.UNDERLINE);
                handleUnderline();
            },
        },
        {
            children: (
                <>
                    <MdFormatColorFill />
                    <p>{t("views.new.context-menu.editor.highlight")}</p>
                </>
            ),
            onClick: () => console.log("highlight"),
        },
        {
            children: (
                <>
                    <MdComment />
                    <p>{t("views.new.context-menu.editor.note")}</p>
                </>
            ),
            onClick: () => console.log("note"),
        },
        {
            children: (
                <>
                    <MdOutlineMenuBook />
                    <p>{t("views.new.context-menu.editor.vocabulary")}</p>
                </>
            ),
            onClick: () => console.log("vocabulary"),
        },
    ];

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

        setContextMenu({ x: e.clientX, y: e.clientY }, items);
    };

    return ({
        numPages,
        onContextMenu,
        onDocumentLoadSuccess,
        pageRefs,
        pdfFile,
        pdfTools,
        setColor,
        setTool,
    });
};
