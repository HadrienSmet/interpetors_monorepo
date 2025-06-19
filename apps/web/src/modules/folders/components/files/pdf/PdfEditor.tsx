import { useMemo } from "react";

import "@/workers/pdfConfig";

import {
    PdfWrapper,
    usePdfCanvas,
    usePdfFile,
    usePdfTools,
} from "../../../contexts";

import { PdfDocument } from "./document";
import { PdfEditorLoader } from "./loader";
import { PdfTools } from "./tools";

import "./pdfEditor.scss";

const PDF_EDITOR_WIDTH = 597 as const;

const PdfEditorChild = () => {
    const { canvasRef, drawerRef } = usePdfCanvas();
    const { containerRef, displayLoader } = usePdfFile();
    const { customCursor } = usePdfTools();

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

            {customCursor && (customCursor)}
        </div>
    );
};

export const PdfEditor = () => (
    <PdfWrapper>
        <PdfEditorChild />
    </PdfWrapper>
);
