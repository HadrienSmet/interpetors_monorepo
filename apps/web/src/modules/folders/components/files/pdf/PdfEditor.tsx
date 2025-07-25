import { useMemo } from "react";

import "@/workers/pdfConfig";

import {
    PdfWrapper,
    usePdfCanvas,
    usePdfFile,
    usePdfTools,
} from "../../../contexts";

import { PdfDocument } from "./document";
import { NotesDisplayer } from "./notes";
import { PdfTools } from "./tools";

import "./pdfEditor.scss";

const PDF_EDITOR_WIDTH = 597 as const;

const PdfEditorChild = () => {
    const { canvasRef, drawerRef } = usePdfCanvas();
    const { containerRef } = usePdfFile();
    const { customCursor } = usePdfTools();

    const canvasStyle = useMemo(() => (
        containerRef.current
            ? { left: (containerRef.current.getBoundingClientRect().width - PDF_EDITOR_WIDTH) / 2, }
            : {}
    ), []);

    return (
        <div
            className="pdf-editor"
            ref={containerRef}
        >
            <PdfTools />

            <div className="document-drawer">
                <PdfDocument />

                {/** Used to draw on mount */}
                <canvas
                    className="on-real-time-displayer"
                    key="canvas"
                    ref={canvasRef}
                    style={canvasStyle}
                />
                {/** Used to draw on user action */}
                <canvas
                    className="on-real-time-displayer"
                    key="drawer"
                    ref={drawerRef}
                    style={canvasStyle}
                />
            </div>

            <NotesDisplayer />

            {customCursor && (customCursor)}
        </div>
    );
};

export const PdfEditor = () => (
    <PdfWrapper>
        <PdfEditorChild />
    </PdfWrapper>
);
