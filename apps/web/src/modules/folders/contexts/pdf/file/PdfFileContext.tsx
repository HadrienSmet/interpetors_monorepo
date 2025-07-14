import { createContext, Dispatch, RefObject, SetStateAction, useContext } from "react";
import { DocumentCallback } from "react-pdf/src/shared/types.js";

import { getContextError } from "@/contexts/utils";
import { PDFDocument } from "@/workers/pdfConfig";

type PdfFileContextType = {
    readonly containerRef: RefObject<HTMLDivElement | null>;
    readonly displayLoader: boolean;
    readonly downloadPdfFile: () => Promise<void>;
    readonly isPdfRendered: boolean;
    readonly nextPage: () => void;
    readonly numPages: number | undefined;
    readonly onDocumentLoadSuccess: (document: DocumentCallback) => void;
    readonly pageIndex: number;
    readonly pageRef: RefObject<HTMLDivElement | null>;
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
