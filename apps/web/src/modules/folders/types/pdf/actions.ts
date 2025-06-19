import { RgbColor } from "@/utils";
import { PDFDocument } from "@/workers/pdfConfig";

import { DRAWING_TYPES, REFERENCE_TYPES } from "./elements";
import { PdfFileInStructure } from "./pdf";
import { PdfTool } from "./tools";

type ActionElement = {
    readonly color: RgbColor;
    readonly pageDimensions: DOMRect;
    readonly pageIndex: number;
    readonly pdfDoc: PDFDocument;
    readonly pdfFile: PdfFileInStructure;
};
type NoteElement =
    & ActionElement
    & {
        readonly noteId: string;
        readonly rectsArray: Array<DOMRect>;
    };
export type ReferenceAction =
    | NoteAction;
export type NoteAction = {
    readonly element: NoteElement;
    readonly type: REFERENCE_TYPES.NOTE;
};
export type RectangleActionElement =
    & ActionElement
    & {
        readonly rectsArray: Array<DOMRect>;
        readonly tool: PdfTool;
    };
export type RectangleAction = {
    readonly element: RectangleActionElement;
    readonly type: DRAWING_TYPES.RECTANGLE;
};

export type TextActionElement =
    & ActionElement
    & {
        readonly rect: DOMRect;
        readonly text: string;
    };
export type TextAction = {
    readonly element: TextActionElement;
    readonly type: DRAWING_TYPES.TEXT;
};
export type ElementAction =
    | RectangleAction
    | TextAction;
