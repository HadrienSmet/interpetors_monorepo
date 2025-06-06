import { RefObject } from "react";

import { PDFDocument } from "@/workers/pdfConfig";

import { PdfEditorToolsState } from "../pdfTools";

export type PageRefs = Array<HTMLCanvasElement | undefined>;
export type UpdatePdfDocumentParams = {
    readonly pageRefs: RefObject<PageRefs>;
    readonly pdfDoc: PDFDocument;
    readonly pdfTools: PdfEditorToolsState;
};
