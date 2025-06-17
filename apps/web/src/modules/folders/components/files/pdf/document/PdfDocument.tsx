import { Document, Page } from "react-pdf";

import { useFoldersManager, usePdfFile, usePdfTools } from "../../../../contexts";

import { PageManager } from "./pageManager";
import "./pdfDocument.scss";


const OPTIONS = {
    cMapPacked: true,
    cMapUrl: "/cmaps/",
    standardFontDataUrl: "/standard_fonts/",
};
export const PdfDocument = () => {
    const { selectedFile } = useFoldersManager();
    const {
        numPages,
        onDocumentLoadSuccess,
        pageRef,
        pageIndex,
        setIsPdfRendered,
    } = usePdfFile();
    const { onContextMenu, tool } = usePdfTools();

    const pdfFile = selectedFile.fileInStructure!;

    const displayPageManager: boolean = (numPages !== undefined && numPages > 1)

    return (
        <div className="pdf-document" ref={pageRef}>
            {displayPageManager && (
                <PageManager />
            )}

            <Document
                file={pdfFile.file}
                loading={null}
                onLoadSuccess={onDocumentLoadSuccess}
                onContextMenu={onContextMenu}
                options={OPTIONS}
            >
                <Page
                    className={`pdf-page ${tool !== null ? "tooling" : ""}`}
                    key={`page_${pageIndex}`}
                    onRenderSuccess={() => setIsPdfRendered(true)}
                    pageNumber={pageIndex}
                    renderAnnotationLayer={false}
                />
            </Document>
        </div>
    );
};
