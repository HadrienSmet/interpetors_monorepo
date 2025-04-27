import { useState } from "react";
import { Document, Page } from "react-pdf";

import type { PDFDocumentProxy } from "pdfjs-dist";

import { Loader } from "@/components/ui";
import "@/workers/pdfConfig";

const options = {
    cMapUrl: "/cmaps/",
    standardFontDataUrl: "/standard_fonts/",
};

type PDFFile = string | File | null;

export const PdfEditor = (props: { file: PDFFile; }) => {
    const [numPages, setNumPages] = useState<number>();


    const onDocumentLoadSuccess = ({ numPages: nextNumPages }: PDFDocumentProxy): void => {
        setNumPages(nextNumPages);
    };

    return (
        <Document
            file={props.file}
            loading={<Loader />}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
        >
            {Array.from(new Array(numPages), (_, index) => (
                <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                />
            ))}
        </Document>
    );
};
