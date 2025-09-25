import { DRAWING_TYPES, TypedElement } from "../../common";

import { PathPdfElement } from "./path";
import { RectanglePdfElement } from "./rectangle";
import { TextPdfElement } from "./text";

export type PdfElement =
    | TypedElement<DRAWING_TYPES.PATH, PathPdfElement>
    | TypedElement<DRAWING_TYPES.RECTANGLE, RectanglePdfElement>
    | TypedElement<DRAWING_TYPES.TEXT, TextPdfElement>;
