import { useMemo } from "react";

import "@/workers/pdfConfig";

import {
    usePdfCanvas,
    usePdfFile,
    usePdfTools,
} from "../../contexts";
import { PDF_WIDTH } from "../../utils";

import { PdfDocument } from "../document";
import { PdfEditorLoader } from "../loader";
import { NotesDisplayer } from "../notes";
import { PdfTools } from "../tools";

import "./pdfEditor.scss";

const FAKE_MARGIN = 6 as const;
export const PdfEditor = () => {
    const { canvasRef, drawerRef } = usePdfCanvas();
    const { containerRef, displayLoader } = usePdfFile();
    const { customCursor, setIsCursorVisible } = usePdfTools();

    const canvasStyle = useMemo(() => (
        containerRef.current
            ? { left: (containerRef.current.getBoundingClientRect().width - PDF_WIDTH) / 2, }
            : {}
    ), []);

    return (
        <div className="pdf-editor-container">
            <PdfTools />

            {displayLoader && (<PdfEditorLoader />)}

            <div
                className="pdf-editor"
				onMouseEnter={() => setIsCursorVisible(true)}
				onMouseLeave={() => setIsCursorVisible(false)}
                ref={containerRef}
            >
                <div className="document-drawer">
                    <PdfDocument />

                    {/** Used to draw on mount */}
                    <canvas
                        className="pdf-editor__canvas"
                        key="canvas"
                        ref={canvasRef}
                        style={canvasStyle}
                    />
                    {/** Used to draw on user action */}
                    <canvas
                        className="pdf-editor__canvas"
                        key="drawer"
                        ref={drawerRef}
                        style={canvasStyle}
                    />
					<div style={{ height: FAKE_MARGIN }} />
                </div>

                <NotesDisplayer />

                {customCursor && (customCursor)}
            </div>
        </div>
    );
};
