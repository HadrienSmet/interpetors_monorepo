import { useMemo } from "react";

import "@/workers/pdfConfig";

import { PdfFileInStructure, PdfWrapper, usePdfCanvas, usePdfFile, usePdfTools } from "../../../contexts";

import { PdfDocument } from "./document";
import { PdfEditorLoader } from "./loader";
import { PdfTools } from "./tools";
import "./pdfEditor.scss";


const PDF_EDITOR_WIDTH = 597 as const;
type PdfEditorProps = {
    readonly fileInStructure: PdfFileInStructure;
    readonly filePath: string;
};
const PdfEditorChildren = () => {
    const { canvasRef } = usePdfCanvas();
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

            <canvas
                className="on-real-time-displayer"
                ref={canvasRef}
                style={canvasStyle}
            />

            {customCursor && (customCursor)}
        </div>
    );
};

export const PdfEditor = (props: PdfEditorProps) => (
    <PdfWrapper {...props}>
        <PdfEditorChildren />
    </PdfWrapper>
);
