import { DRAWING_TYPES, Position, TypedElement } from "@repo/types";

import { RectangleElement, TextOptions } from "../types";

export type PathCanvasElement = {
    readonly color: string;
    readonly points: Array<Position>;
};
export type RectCanvasElement =
    & RectangleElement
    & { readonly color: string; };
type TextCanvasOptions =
    & TextOptions
    & { readonly color: string; };
export type TextCanvasElement = {
    readonly options: TextCanvasOptions;
    readonly text: string;
};
export type CanvasElement =
    | TypedElement<DRAWING_TYPES.PATH, PathCanvasElement>
    | TypedElement<DRAWING_TYPES.RECT, RectCanvasElement>
    | TypedElement<DRAWING_TYPES.TEXT, TextCanvasElement>;
