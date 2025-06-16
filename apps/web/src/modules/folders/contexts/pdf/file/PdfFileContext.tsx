import { createContext, Dispatch, RefObject, SetStateAction, useContext } from "react";

import type { PDFDocumentProxy } from "pdfjs-dist";

import { getContextError } from "@/contexts/utils";
import { PDFDocument } from "@/workers/pdfConfig";

export type PageRefs = Array<HTMLCanvasElement | undefined>;
type PdfFileContextType = {
    readonly containerRef: RefObject<HTMLDivElement | null>;
    readonly displayLoader: boolean;
    readonly isPdfRendered: boolean;
    readonly nextPage: () => void;
    readonly numPages: number | undefined;
    readonly onDocumentLoadSuccess: (proxy: PDFDocumentProxy) => void;
    readonly pageIndex: number;
    // TODO Probably not needed anymore should be pageRef
    readonly pageRef: RefObject<HTMLDivElement | null>;
    readonly pageRefs: RefObject<PageRefs>;
    /** Might not needed */
    readonly pdfDoc: PDFDocument | undefined;
    readonly previousPage: () => void;
    readonly renderedPages: RefObject<number>;
    readonly setDisplayLoader: Dispatch<SetStateAction<boolean>>;
    // TODO - Logic should be changed since single page
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
