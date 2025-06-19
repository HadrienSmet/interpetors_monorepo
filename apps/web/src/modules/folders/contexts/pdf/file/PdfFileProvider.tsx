import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { PDFDocumentProxy } from "pdfjs-dist";

import { PDFDocument } from "@/workers/pdfConfig";

import { useFoldersManager } from "../../manager";

import { PageRefs, PdfFileContext } from "./PdfFileContext";

export const PdfFileProvider = ({ children }: PropsWithChildren) => {
    const [displayLoader, setDisplayLoader] = useState(true);
    const [isPdfRendered, setIsPdfRendered] = useState(false);
    /** Number of pages of the pdf file */
    const [numPages, setNumPages] = useState<number>();
    const [pageIndex, setPageIndex] = useState(1);
    /** Pdf document - Used to interact with the binary */
    const [pdfDoc, setPdfDoc] = useState<PDFDocument>();

    const containerRef = useRef<HTMLDivElement>(null);
    /**
     * Refs of each page used to display the pdf file
     * Used to know the positions of the interactions
     */
    const pageRefs = useRef<PageRefs>([]);
    const pageRef = useRef<HTMLDivElement | null>(null);
    const renderedPages = useRef(0);

    const { selectedFile } = useFoldersManager();

    const nextPage = () => setPageIndex(state => Math.min(state + 1, numPages ?? 1));
    const previousPage = () => setPageIndex(state => Math.max(state - 1, 1));

    const onDocumentLoadSuccess = ({ numPages: nextNumPages }: PDFDocumentProxy): void => (
        setNumPages(nextNumPages)
    );

    // ------ USE EFFECTS ------
    useEffect(() => {
        setIsPdfRendered(false);
    }, [selectedFile.path, pageIndex]);
    // Removes the loader when the pdf is displayed
    useEffect(() => {
        if (isPdfRendered) {
            // Between 200 and 500 ms
            const randomTimeout = Math.ceil((Math.random() * 300)) + 200;
            setTimeout(() => {
                setDisplayLoader(false);
            }, randomTimeout);
        }
    }, [isPdfRendered]);
    // Stores the pdf file as a PDFDocument that we will be able to edit
    // And resets all the indicators used to know if the pdf is rendered when pdf file changes
    useEffect(() => {
        renderedPages.current = 0;

        setIsPdfRendered(false);
        setNumPages(0);

        const loadPdf = async () => {
            if (!selectedFile.fileInStructure) return;

            const pdfFile = selectedFile.fileInStructure

            const arrayBuffer = typeof pdfFile.file === "string"
                ? await fetch(pdfFile.file).then(res => res.arrayBuffer())
                : await pdfFile.file.arrayBuffer();

            const pdfDoc = await PDFDocument.load(arrayBuffer);
            setPdfDoc(pdfDoc);
        };

        loadPdf();
    }, [selectedFile.fileInStructure?.file]);

    const value = {
        containerRef,
        displayLoader,
        isPdfRendered,
        nextPage,
        numPages,
        onDocumentLoadSuccess,
        pageIndex,
        pageRef,
        pageRefs,
        pdfDoc,
        previousPage,
        renderedPages,
        setDisplayLoader,
        setIsPdfRendered,
    };

    return (
        <PdfFileContext.Provider value={value}>
            {children}
        </PdfFileContext.Provider>
    );
};
