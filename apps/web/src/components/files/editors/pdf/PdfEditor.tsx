import { useMemo } from "react";
import { Document, Page } from "react-pdf";

import { Loader } from "@/components";
import "@/workers/pdfConfig";

import { PDF_TOOLS, PdfTools } from "./pdfTools";
import { usePdfEditor, UsePdfEditorProps } from "./usePdfEditor";
import "./pdfEditor.scss";

const PdfEditorLoader = () => (
    <div className="loader-container">
        <Loader size="fullScreen" />
    </div>
);

const OPTIONS = {
    cMapUrl: "/cmaps/",
    standardFontDataUrl: "/standard_fonts/",
};
const PDF_EDITOR_WIDTH = 597 as const;

export const PdfEditor = (props: UsePdfEditorProps) => {
    const {
        canvasRef,
        containerRef,
        customCursor,
        numPages,
        onContextMenu,
        onDocumentLoadSuccess,
        onToolSelection,
        pageRefs,
        pdfFile,
        pdfTools,
        renderedPages,
        setColor,
        setIsPdfRendered,
    } = usePdfEditor(props);

    const canvasStyle = useMemo(() => (
        containerRef.current
            ? {
                left: (containerRef.current.getBoundingClientRect().width - PDF_EDITOR_WIDTH)/2,
            }
            : {}
    ), []);

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
                loading={<PdfEditorLoader />}
                onLoadSuccess={onDocumentLoadSuccess}
                onContextMenu={onContextMenu}
                options={OPTIONS}
            >
                {Array.from(new Array(numPages), (_, index) => {
                    const pageNumber = index + 1;

                    const onRenderSuccess = () => {
                        renderedPages.current += 1;
                        if (renderedPages.current === numPages) {
                            setIsPdfRendered(true);
                        }
                    };

                    return (
                        <div
                            className={`page-container ${pdfTools.tool === PDF_TOOLS.BRUSH ? "brushing" : ""}`}
                            key={`page_${pageNumber}`}
                        >
                            <Page
                                canvasRef={el => {
                                    if (el) pageRefs.current[index] = el;
                                }}
                                onRenderSuccess={onRenderSuccess}
                                pageNumber={pageNumber}
                            />
                        </div>
                    );
                })}
            </Document>

            <canvas
                className="on-real-time-displayer"
                ref={canvasRef}
                style={canvasStyle}
            />

            {customCursor && (customCursor)}
        </div>
    );
};
