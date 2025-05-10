import { useState } from "react";
import { Document, Page } from "react-pdf";

import type { PDFDocumentProxy } from "pdfjs-dist";

import { Loader } from "@/components";
import "@/workers/pdfConfig";

import { PdfTools } from "./pdfTools";
import "./pdfEditor.scss";

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
        <div className="pdf-editor">
            <PdfTools />
            <Document
                file={props.file}
                loading={(
                    <div className="loader-container">
                        <Loader size="fullScreen" />
                    </div>
                )}
                onLoadSuccess={onDocumentLoadSuccess}
                options={options}
            >
                {Array.from(new Array(numPages), (_, index) => (
                    <div
                        className="page-container"
                        key={`page_${index + 1}`}
                    >
                        <Page
                            pageNumber={index + 1}
                        />
                    </div>
                ))}
            </Document>
        </div>
    );
};
