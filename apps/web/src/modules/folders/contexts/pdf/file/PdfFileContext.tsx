import { createContext, Dispatch, RefObject, SetStateAction, useContext } from "react";

import type { PDFDocumentProxy } from "pdfjs-dist";

import { getContextError } from "@/contexts/utils";
import { PDFDocument } from "@/workers/pdfConfig";

import { FileInStructure } from "../../manager";

export type PageRefs = Array<HTMLCanvasElement | undefined>;
type PdfFileContextType = {
    readonly containerRef: RefObject<HTMLDivElement | null>;
    readonly displayLoader: boolean;
    readonly filePath: string;
    readonly isPdfRendered: boolean;
    readonly numPages: number | undefined;
    readonly onDocumentLoadSuccess: (proxy: PDFDocumentProxy) => void;
    readonly pageRefs: RefObject<PageRefs>;
    readonly pdfDoc: PDFDocument | undefined;
    readonly pdfFile: FileInStructure;
    readonly renderedPages: RefObject<number>;
    readonly setDisplayLoader: Dispatch<SetStateAction<boolean>>;
    readonly setIsPdfRendered: Dispatch<SetStateAction<boolean>>;
};

export const PdfFileContext = createContext<PdfFileContextType | null>(null);

export const usePdfFile = () => {
    const context = useContext(PdfFileContext);

    if (!context) {
        throw new Error(getContextError("usePdfFile", "PdfFileProvider"));
    }

    return (context);
};
