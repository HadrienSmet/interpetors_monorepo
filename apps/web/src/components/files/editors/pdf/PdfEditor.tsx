import { useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import { rgb } from "pdf-lib";
import type { PDFDocumentProxy } from "pdfjs-dist";

import { Loader, RgbColor } from "@/components";
import { PDFDocument } from "@/workers/pdfConfig";
import "@/workers/pdfConfig";

import { PdfEditorToolsState, PdfTools, PDF_TOOLS } from "./pdfTools";
import "./pdfEditor.scss";

const options = {
    cMapUrl: "/cmaps/",
    standardFontDataUrl: "/standard_fonts/",
};

type PDFFile = string | File | null;

export const PdfEditor = (props: { file: PDFFile; }) => {
    const [numPages, setNumPages] = useState<number>();
    const [pdfDoc, setPdfDoc] = useState<PDFDocument>();
    const [pdfFile, setPdfFile] = useState<PDFFile>(props.file);
    const [pdfTools, setPdfTools] = useState<PdfEditorToolsState>({
        tool: null,
        color: {
            r: 0.2,
            g: 1,
            b: 0,
        },
    });
    const [textSelection, setTextSelection] = useState<Selection | null>(null);

    const pageRefs = useRef<(HTMLCanvasElement | undefined)[]>([]);

    const onDocumentLoadSuccess = ({ numPages: nextNumPages }: PDFDocumentProxy): void => {
        setNumPages(nextNumPages);
    };
    const setColor = (color: RgbColor) => setPdfTools(state => ({ ...state, color }));
    const setTool = (tool: PDF_TOOLS | null) => setPdfTools(state => ({ ...state, tool }));

    const handleUnderline = async () => {
        if (!pdfDoc || pdfTools.tool !== PDF_TOOLS.UNDERLINE) {
            return;
        }

        const selection = document.getSelection();
        if (!selection || selection.isCollapsed) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        if (!selectedText.trim()) return;

        const rects = range.getClientRects();

        Array.from(rects).forEach(rect => {
            const pageRef = pageRefs.current.find(ref => {
                if (!ref) return false;
                const { top, bottom } = ref.getBoundingClientRect();
                return rect.top >= top && rect.bottom <= bottom;
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
            const selection = document.getSelection();

            setTextSelection(selection);
        });

        return () => {
            document.removeEventListener("selectionchange", () => {
                const selection = document.getSelection();

                setTextSelection(selection);
            });
        }
    }, []);

    // Handles the text underline
    useEffect(() => {
        const handleMouseUp = () => {
            if (pdfTools.tool === PDF_TOOLS.UNDERLINE) {
                handleUnderline();
            }
        };

        if (textSelection) {
            handleMouseUp();
        }

        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [pdfTools, pdfDoc, textSelection]);

    return (
        <div
            className="pdf-editor"
        >
            <PdfTools
                {...pdfTools}
                setColor={setColor}
                setTool={setTool}
            />
            <Document
                file={pdfFile}
                loading={(
                    <div className="loader-container">
                        <Loader size="fullScreen" />
                    </div>
                )}
                onLoadSuccess={onDocumentLoadSuccess}
                options={options}
            >
                {Array.from(new Array(numPages), (_, index) => {
                    const pageNumber = index + 1;

                    return (
                        <div
                            className="page-container"
                            key={`page_${pageNumber}`}
                        >
                            <Page
                                canvasRef={el => {
                                    if (el) pageRefs.current[index] = el;
                                }}
                                pageNumber={pageNumber}
                            />
                        </div>
                    );
                })}
            </Document>
        </div>
    );
};
