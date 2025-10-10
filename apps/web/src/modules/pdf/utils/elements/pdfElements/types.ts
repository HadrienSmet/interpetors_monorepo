import { Color } from "pdf-lib";

import { DRAWING_TYPES, TypedElement } from "@repo/types";

import { RectangleElement, TextOptions } from "../types";

export type PathPdfOptions = {
    readonly borderColor: Color;
    readonly borderWidth: number;
    readonly opacity: number;
    readonly x: number;
    readonly y: number;
};
export type PathPdfElement = {
    readonly options: PathPdfOptions;
    readonly path: string;
};
export type RectPdfElement =
    & RectangleElement
    & {
        readonly color: Color;
        readonly opacity: number;
    };
export type TextPdfOptions =
    & TextOptions
    & { readonly color: Color; };
export type TextPdfElement = {
    readonly options: TextPdfOptions;
    readonly text: string;
};
export type PdfElement =
    | TypedElement<DRAWING_TYPES.PATH, PathPdfElement>
    | TypedElement<DRAWING_TYPES.RECT, RectPdfElement>
    | TypedElement<DRAWING_TYPES.TEXT, TextPdfElement>;
