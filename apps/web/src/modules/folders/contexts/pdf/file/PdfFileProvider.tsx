import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { PDFDocumentProxy } from "pdfjs-dist";

import { PDFDocument } from "@/workers/pdfConfig";

import { FileInStructure } from "../../manager/foldersManager.types";

import { PageRefs, PdfFileContext } from "./PdfFileContext";
// import { usePdfHistory } from "../history";

type PdfFileProviderProps =
    & {
        readonly fileInStructure: FileInStructure;
        readonly filePath: string;
    }
    & PropsWithChildren;
export const PdfFileProvider = ({ children, fileInStructure, filePath }: PdfFileProviderProps) => {
    const [displayLoader, setDisplayLoader] = useState(true);
    const [isPdfRendered, setIsPdfRendered] = useState(false);
    /** Number of pages of the pdf file */
    const [numPages, setNumPages] = useState<number>();
    /** Pdf document - Used to interact with the binary */
    const [pdfDoc, setPdfDoc] = useState<PDFDocument>();
    /** Displayed File in Structure */
    const [pdfFile, setPdfFile] = useState(fileInStructure);

    const containerRef = useRef<HTMLDivElement>(null);
    /**
     * Refs of each page used to display the pdf file
     * Used to know the positions of the interactions
     */
    const pageRefs = useRef<PageRefs>([]);
    const renderedPages = useRef(0);

    // const { elements, references } = usePdfHistory();

    const onDocumentLoadSuccess = ({ numPages: nextNumPages }: PDFDocumentProxy): void => (
        setNumPages(nextNumPages)
    );

    // ------ USE EFFECTS ------
    // Display another file when the props changes
    useEffect(() => {
        setPdfFile(fileInStructure);
    }, [fileInStructure]);
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
            if (!pdfFile) return;

            const arrayBuffer = typeof pdfFile === "string"
                ? await fetch(pdfFile).then(res => res.arrayBuffer())
                : await pdfFile.file.arrayBuffer();

            const pdfDoc = await PDFDocument.load(arrayBuffer);
            setPdfDoc(pdfDoc);
        };

        loadPdf();
    }, [pdfFile]);

    // TODO Needs to add the useEffect Responsible to watch the userActions
    // And to convert them into canvasElements and pdfElements
    // And to call files.update

    const value = {
        containerRef,
        displayLoader,
        filePath,
        isPdfRendered,
        numPages,
        onDocumentLoadSuccess,
        pageRefs,
        pdfDoc,
        pdfFile,
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
