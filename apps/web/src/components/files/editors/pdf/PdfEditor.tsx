import { Document, Page } from "react-pdf";

import { Loader } from "@/components";
import "@/workers/pdfConfig";

import { PdfTools } from "./pdfTools";
import { usePdfEditor, UsePdfEditorProps } from "./usePdfEditor";
import "./pdfEditor.scss";

const options = {
    cMapUrl: "/cmaps/",
    standardFontDataUrl: "/standard_fonts/",
};

export const PdfEditor = (props: UsePdfEditorProps) => {
    const {
        containerRef,
        customCursor,
        numPages,
        onContextMenu,
        onDocumentLoadSuccess,
        onToolSelection,
        pageRefs,
        pdfFile,
        pdfTools,
        setColor,
    } = usePdfEditor(props);

    return (
        <div
            className="pdf-editor"
            ref={containerRef}
        >
            <PdfTools
                {...pdfTools}
                onToolSelection={onToolSelection}
                setColor={setColor}
            />
            <Document
                file={pdfFile}
                loading={(
                    <div className="loader-container">
                        <Loader size="fullScreen" />
                    </div>
                )}
                onLoadSuccess={onDocumentLoadSuccess}
                onContextMenu={onContextMenu}
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
            {customCursor && (customCursor)}
        </div>
    );
};
