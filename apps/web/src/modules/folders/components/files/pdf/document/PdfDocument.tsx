import { Document, Page } from "react-pdf";

import { useFoldersManager, usePdfFile, usePdfTools } from "../../../../contexts";
import { REFERENCE_TYPES } from "../../../../types";

import { TextInteractive } from "../textInteractive";

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

    const displayNoteReferences = (
        pdfFile.elements[pageIndex] &&
        pdfFile.elements[pageIndex].references.length > 0
    );
    const displayPageManager: boolean = (
        numPages !== undefined &&
        numPages > 1
    );

    const onLoadError = (error: Error) => console.error("An error occured while loading document", error);

    return (
        <div className="pdf-document" ref={pageRef}>
            {displayPageManager && (<PageManager />)}

            <Document
                file={pdfFile.file}
                loading={null}
                onLoadError={onLoadError}
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

            {displayNoteReferences && pdfFile.elements[pageIndex].references
                .filter(ref => ref.type === REFERENCE_TYPES.NOTE)
                .map((ref, i) => (
                    <TextInteractive
                        key={`noteRef-${pageIndex}-${i}`}
                        note={ref.element}
                        i={i}
                        index={pageIndex}
                    />
                ))
            }
        </div>
    );
};
