import { DRAWING_TYPES, TypedElement } from "../../../common";

import { PathCanvasElement } from "./path";
import { RectangleCanvasElement } from "./rectangle";
import { TextCanvasElement } from "./text";

export type CanvasElement =
    | TypedElement<DRAWING_TYPES.PATH, PathCanvasElement>
    | TypedElement<DRAWING_TYPES.RECTANGLE, RectangleCanvasElement>
    | TypedElement<DRAWING_TYPES.TEXT, TextCanvasElement>;
