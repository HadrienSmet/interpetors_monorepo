import { Document, Page } from "react-pdf";

import { REFERENCE_TYPES, usePdfFile, usePdfTools } from "../../../../contexts";
import { PDF_TOOLS } from "../../../../types";

import { TextInteractive } from "../textInteractive";

const OPTIONS = {
    cMapPacked: true,
    cMapUrl: "/cmaps/",
    standardFontDataUrl: "/standard_fonts/",
};
export const PdfDocument = () => {
    const { numPages, onDocumentLoadSuccess, pageRefs, pdfFile, renderedPages, setIsPdfRendered } = usePdfFile();
    const { onContextMenu, tool } = usePdfTools();

    return (
        <Document
            file={pdfFile.file}
            loading={null}
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
                        className={`pdf-page-container ${tool === PDF_TOOLS.BRUSH ? "brushing" : ""}`}
                        key={`page_${pageNumber}`}
                    >
                        <Page
                            canvasRef={el => {
                                if (el) pageRefs.current[index] = el;
                            }}
                            onRenderSuccess={onRenderSuccess}
                            pageNumber={pageNumber}
                            renderAnnotationLayer={false}
                        />
                        {pdfFile.references
                            .filter(ref => ref.element.pageIndex === index && ref.type === REFERENCE_TYPES.NOTE)
                            .map((ref, i) => (
                                <TextInteractive
                                    key={`noteRef-${index}-${i}`}
                                    note={ref.element}
                                    i={i}
                                    index={index}
                                />
                            ))
                        }
                    </div>
                );
            })}
        </Document>
    );
};
