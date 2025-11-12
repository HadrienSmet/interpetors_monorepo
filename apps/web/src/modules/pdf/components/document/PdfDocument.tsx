import { Document, Page } from "react-pdf";
import { useSearchParams } from "react-router";

import { REFERENCE_TYPES } from "@repo/types";

import { useFoldersManager } from "@/modules/folders";
import { URL_PARAMETERS, URL_VIEWS } from "@/utils";

import { usePdfFile, usePdfNotes, usePdfTools } from "../../contexts";

import { TextInteractive } from "../textInteractive";

import { PageManager } from "./pageManager";
import "./pdfDocument.scss";

const OPTIONS = {
    cMapPacked: true,
    cMapUrl: "/cmaps/",
    standardFontDataUrl: "/standard_fonts/",
} as const;

export const PdfDocument = () => {
    const { selectedFile } = useFoldersManager();
    const { numPages, onDocumentLoadSuccess, pageIndex, pageRef, setIsPdfRendered } = usePdfFile();
    const { setSelectedNote } = usePdfNotes();
    const { onContextMenu, tool } = usePdfTools();
    const [_, setSearchParams] = useSearchParams();

    const pdfFile = selectedFile.fileInStructure!;

    const displayNoteReferences = (
        pdfFile.actions[pageIndex] &&
        pdfFile.actions[pageIndex].references &&
        pdfFile.actions[pageIndex].references.length > 0
    );
    const displayPageManager: boolean = (
        numPages !== undefined &&
        numPages > 1
    );

    const onLoadError = (error: Error) => console.error("An error occured while loading document", error);
    const onRenderError = (error: Error) => console.error("An error occured while loading page", error);
    const onRenderSucces = () => setIsPdfRendered(true);
    const onNoteClick = (id: string) => setSelectedNote(id);
    const onVocClick = (id: string) => setSearchParams(prev => {
        const next = new URLSearchParams(prev);

        next.set(URL_PARAMETERS.view, URL_VIEWS.vocabulary);
        next.set(URL_PARAMETERS.term, id);
        next.delete(URL_PARAMETERS.filepath);

        return (next);
    });

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
                    onRenderError={onRenderError}
                    onRenderSuccess={onRenderSucces}
                    pageNumber={pageIndex}
                    renderAnnotationLayer={false}
                />
            </Document>

            {displayNoteReferences && pdfFile.actions[pageIndex].references!
                .map((ref, i) => {
                    if (ref.type === REFERENCE_TYPES.NOTE) {
                        return (
                            <TextInteractive
                                key={`interactiveRef-${pageIndex}-${i}`}
                                onClick={() => onNoteClick(ref.element.id)}
                                referencingText={ref.element}
                                title="Navigate to note"
                            />
                        );
                    }

                    return (
                        <TextInteractive
                            key={`noteRef-${pageIndex}-${i}`}
                            onClick={() => onVocClick(ref.element.id)}
                            referencingText={ref.element}
                            title="Navigate to vocabulary"
                        />
                    );
                })
            }
        </div>
    );
};
