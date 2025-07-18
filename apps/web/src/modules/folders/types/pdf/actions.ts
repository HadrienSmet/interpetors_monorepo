import { Position } from "@/types";
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
//==========================
//=   INTERRACTIVE TEXTS   =
//==========================
type InterractiveNoteElement =
    & ActionElement
    & {
        readonly rectsArray: Array<DOMRect>;
        readonly id: string;
    };
export type InterractiveNoteAction = {
    readonly element: InterractiveNoteElement;
    readonly type: REFERENCE_TYPES.NOTE;
};
export type InterractiveVocabularyElement =
    & ActionElement
    & {
        readonly rectsArray: Array<DOMRect>;
        readonly id: string;
    };
export type InterractiveVocabularyAction = {
    readonly element: InterractiveVocabularyElement;
    readonly type: REFERENCE_TYPES.VOCABULARY;
};
export type InterractiveReferenceAction =
    | InterractiveNoteAction
    | InterractiveVocabularyAction;

//========================
//=   ELEMENTS TO DRAW   =
//========================
export type PathElementAction =
    & ActionElement
    & { readonly points: Array<Position>; };
export type PathAction = {
    readonly element: PathElementAction;
    readonly type: DRAWING_TYPES.PATH;
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
    | PathAction
    | RectangleAction
    | TextAction;
