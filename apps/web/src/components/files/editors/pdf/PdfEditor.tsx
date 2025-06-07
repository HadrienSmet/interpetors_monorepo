import { useMemo } from "react";
import { Document, Page } from "react-pdf";
import { useNavigate } from "react-router-dom";

import { Loader } from "@/components";
import { NoteInStructure } from "@/contexts";
import "@/workers/pdfConfig";

import { PDF_TOOLS, PdfTools } from "./pdfTools";
import { usePdfEditor, UsePdfEditorProps } from "./usePdfEditor";
import "./pdfEditor.scss";

const PdfEditorLoader = () => (
    <div className="loader-container">
        <Loader size="fullScreen" />
    </div>
);
const TextInteractive = ({ note, index, i }: { note: NoteInStructure; index: number, i: number; }) => {
    const navigate = useNavigate();

    const onClick = () => {
        navigate(`/prepare/notes?note=${note.noteId}`);
    };
    const onMouseEnter = () => {
        document
            .querySelectorAll(`.note-group-${note.noteId}`)
            .forEach(el => el.classList.add("hovered"));
    };
    const onMouseLeave = () => {
        document
            .querySelectorAll(`.note-group-${note.noteId}`)
            .forEach(el => el.classList.remove("hovered"));
    };

    return (
        <button
            className={`note-ref-overlay note-group-${note.noteId}`}
            key={`noteRef-${index}-${i}`}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{
                height: `${note.height}px`,
                left: `${note.x}px`,
                top: `${note.y}px`,
                width: `${note.width}px`,
            }}
            title="Navigate to note"
        />
    );
};

const OPTIONS = {
    cMapPacked: true,
    cMapUrl: "/cmaps/",
    standardFontDataUrl: "/standard_fonts/",
};
const PDF_EDITOR_WIDTH = 597 as const;

export const PdfEditor = (props: UsePdfEditorProps) => {
    const {
        canvasRef,
        containerRef,
        customCursor,
        displayLoader,
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
                left: (containerRef.current.getBoundingClientRect().width - PDF_EDITOR_WIDTH) / 2,
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
                            className={`page-container ${pdfTools.tool === PDF_TOOLS.BRUSH ? "brushing" : ""}`}
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
                            {pdfFile.noteReferences
                                .filter(ref => ref.pageIndex === index)
                                .map((ref, i) => (
                                    <TextInteractive
                                        key={`noteRef-${index}-${i}`}
                                        note={ref}
                                        i={i}
                                        index={index}
                                    />
                                ))
                            }
                        </div>
                    );
                })}
            </Document>

            {displayLoader && (<PdfEditorLoader />)}

            <canvas
                className="on-real-time-displayer"
                ref={canvasRef}
                style={canvasStyle}
            />

            {customCursor && (customCursor)}
        </div>
    );
};
