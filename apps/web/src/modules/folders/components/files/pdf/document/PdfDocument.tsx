import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { Document, Page } from "react-pdf";

import { useFoldersManager, usePdfFile, usePdfTools } from "../../../../contexts";
import { PDF_TOOLS } from "../../../../types";

import "./pdfDocument.scss";


const OPTIONS = {
    cMapPacked: true,
    cMapUrl: "/cmaps/",
    standardFontDataUrl: "/standard_fonts/",
};
export const PdfDocument = () => {
    const { selectedFile } = useFoldersManager();
    const {
        nextPage,
        onDocumentLoadSuccess,
        pageRef,
        pageIndex,
        previousPage,
        setIsPdfRendered,
    } = usePdfFile();
    const { onContextMenu, tool } = usePdfTools();

    const pdfFile = selectedFile.fileInStructure!;

    return (
        <div className="pdf-document-container" ref={pageRef}>
            <div className="page-manager">
                <button onClick={previousPage}>
                    <MdArrowBack />
                </button>
                <button onClick={nextPage}>
                    <MdArrowForward />
                </button>
            </div>
            <Document
                file={pdfFile.file}
                loading={null}
                onLoadSuccess={onDocumentLoadSuccess}
                onContextMenu={onContextMenu}
                options={OPTIONS}
            >
                <Page
                    className={`pdf-page-container ${tool === PDF_TOOLS.BRUSH ? "brushing" : ""}`}
                    key={`page_${pageIndex}`}
                    onRenderSuccess={() => setIsPdfRendered(true)}
                    pageNumber={pageIndex}
                    renderAnnotationLayer={false}
                />
            </Document>

        </div>
    );
};
