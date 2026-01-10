import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { DocumentCallback } from "react-pdf/src/shared/types.js";
import { useSearchParams } from "react-router";

import { useColorPanel } from "@/modules/colorPanel";
import { FIRST_PAGE } from "@/modules/files";
import { useFoldersActions, useFoldersManager } from "@/modules/folders";
import { sleep, URL_PARAMETERS } from "@/utils";
import { PDFDocument } from "@/workers/pdfConfig";

import { downloadPdf, handleSaveChanges } from "../../utils";

import { PdfFileContext } from "./PdfFileContext";

export const PdfFileProvider = ({ children }: PropsWithChildren) => {
    const [displayLoader, setDisplayLoader] = useState(false);
    const [isPdfRendered, setIsPdfRendered] = useState(false);
    /** Number of pages of the pdf file */
    const [numPages, setNumPages] = useState<number>(-1);
    const [pageIndex, setPageIndex] = useState(1);
    /** Pdf document - Used to interact with the binary */
    const [pdfDoc, setPdfDoc] = useState<PDFDocument>();

    const containerRef = useRef<HTMLDivElement>(null);
    const pageRef = useRef<HTMLDivElement | null>(null);
    const renderedPages = useRef(0);
    const scrollableParentRef = useRef<HTMLDivElement | null>(null);

    const { colorPanel } = useColorPanel();
    const { getFileActions } = useFoldersActions();
    const { files, selectedFile } = useFoldersManager();
    const [searchParams, setSearchParams] = useSearchParams();

    const urlPageIndex = searchParams.get(URL_PARAMETERS.pageIndex);

    const nextPage = () => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);

            next.set(URL_PARAMETERS.pageIndex, Math.min(pageIndex + 1, numPages ?? 1).toString());

            return (next);
        });
    };
    const previousPage = () => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);

            next.set(URL_PARAMETERS.pageIndex, Math.max(pageIndex - 1, 1).toString());

            return (next);
        });
    };

    const onDocumentLoadSuccess = ({ numPages: nextNumPages }: DocumentCallback): void => (
        setNumPages(nextNumPages)
    );

    const savePdfFileChanges = async  () => {
        setDisplayLoader(true);
        setIsPdfRendered(false);

        await sleep(450);

        const metadata = selectedFile.fileInStructure;
        if (!metadata || !pdfDoc) {
            return;
        }

        const fileActions = getFileActions(metadata.id);
        const pdfFile = { ...metadata, actions: fileActions };
        const updatedFile = await handleSaveChanges(pdfFile, pdfDoc, numPages, colorPanel);
        files.update(updatedFile);

        return (pdfDoc);
    };
    const downloadPdfFile = async () => {
        const updatedDocument = await savePdfFileChanges();

        if (!updatedDocument || !selectedFile.fileInStructure) return;

        downloadPdf(updatedDocument, selectedFile.fileInStructure?.name)
    };

    // ------ USE EFFECTS ------
    useEffect(() => {
        if (selectedFile.path === "") {
            return;
        }
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);

            next.set(URL_PARAMETERS.pageIndex, `${FIRST_PAGE}`);
            next.set(URL_PARAMETERS.filepath, selectedFile.path);

            return (next);
        });
    }, [selectedFile.path]);
    // Display the right page depending on url -> Example on vocabulary occurence link
    useEffect(() => {
        if (!urlPageIndex) return;

        const numPageIndex = Number(urlPageIndex);

        if (!Number.isFinite(numPageIndex)) return;
        if (pageIndex === numPageIndex) return;

        setPageIndex(numPageIndex);
    }, [pageIndex, urlPageIndex]);
    useEffect(() => {
        setIsPdfRendered(false);
    }, [selectedFile.path, pageIndex]);
    // Removes the loader when the pdf is displayed
    useEffect(() => {
        if (isPdfRendered) {
            // Between 400 and 700 ms
            const randomTimeout = Math.ceil((Math.random() * 300)) + 400;
            setTimeout(() => {
                setDisplayLoader(false);
            }, randomTimeout);
        }
        if (selectedFile.path !== "") {
            setDisplayLoader(true);
        }
    }, [isPdfRendered, selectedFile.path]);
    // Stores the pdf file as a PDFDocument that we will be able to edit
    // And resets all the indicators used to know if the pdf is rendered when pdf file changes
    useEffect(() => {
        renderedPages.current = 0;

        setIsPdfRendered(false);
        setNumPages(0);

        const loadPdf = async () => {
            if (!selectedFile.fileInStructure) return;

            const pdfFile = selectedFile.fileInStructure;

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
        downloadPdfFile,
        isPdfRendered,
        nextPage,
        numPages,
        onDocumentLoadSuccess,
        pageIndex,
        pageRef,
        previousPage,
        renderedPages,
        scrollableParentRef,
        setIsPdfRendered,
    };

    return (
        <PdfFileContext.Provider value={value}>
            {children}
        </PdfFileContext.Provider>
    );
};
