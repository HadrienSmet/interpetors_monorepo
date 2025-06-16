import { useMemo } from "react";

import "@/workers/pdfConfig";

import {
    PdfWrapper,
    REFERENCE_TYPES,
    useFoldersManager,
    usePdfCanvas,
    usePdfFile,
    usePdfTools,
} from "../../../contexts";

import { PdfDocument } from "./document";
import { PdfEditorLoader } from "./loader";
import { TextInteractive } from "./textInteractive";
import { PdfTools } from "./tools";

import "./pdfEditor.scss";

const PDF_EDITOR_WIDTH = 597 as const;

const PdfEditorChild = () => {
    const { selectedFile } = useFoldersManager();
    const { canvasRef, drawerRef } = usePdfCanvas();
    const { containerRef, displayLoader, pageIndex } = usePdfFile();
    const { customCursor } = usePdfTools();

    const pdfFile = selectedFile.fileInStructure!;

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
            <PdfTools />
            <PdfDocument />

            {displayLoader && (<PdfEditorLoader />)}

            {/** Used to draw on mount */}
            <canvas
                className="on-real-time-displayer"
                ref={canvasRef}
                style={canvasStyle}
            />
            {/** Used to draw on user action */}
            <canvas
                className="on-real-time-displayer"
                ref={drawerRef}
                style={canvasStyle}
            />

            {pdfFile.references
                .filter(ref => ref.element.pageIndex === pageIndex && ref.type === REFERENCE_TYPES.NOTE)
                .map((ref, i) => (
                    <TextInteractive
                        key={`noteRef-${pageIndex}-${i}`}
                        note={ref.element}
                        i={i}
                        index={pageIndex}
                    />
                ))
            }

            {customCursor && (customCursor)}
        </div>
    );
};

export const PdfEditor = () => (
    <PdfWrapper>
        <PdfEditorChild />
    </PdfWrapper>
);
