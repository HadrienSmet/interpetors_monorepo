import { Color } from "pdf-lib";

export enum DRAWING_TYPES {
    PATH = "path",
    RECTANGLE = "rectangle",
    TEXT = "text",
}
export enum REFERENCE_TYPES {
    NOTE = "note",
    VOCABULARY = "vocabulary",
}

type PathOptions = {
    readonly borderWidth: number;
    readonly opacity: number;
    readonly x: number;
    readonly y: number;
};
type PathCanvasOptions =
    & PathOptions
    & { readonly borderColor: string; };
export type PathCanvasElement = {
    readonly options: PathCanvasOptions;
    readonly pageIndex: number;
    readonly path: string;
};
type PathPdfOptions =
    & PathOptions
    & { readonly borderColor: Color; };
export type PathPdfElement = {
    readonly options: PathPdfOptions;
    readonly pageIndex: number;
    readonly path: string;
};
type RectangleElement = {
    readonly height: number;
    readonly pageIndex: number;
    readonly x: number;
    readonly y: number;
    readonly width: number;
};
export type RectangleCanvasElement =
    & RectangleElement
    & { readonly color: string; };
export type RectanglePdfElement =
    & RectangleElement
    & { readonly color: Color; };

type TextOptions = {
    readonly size: number;
    readonly x: number;
    readonly y: number;
};
type TextCanvasOptions =
    & TextOptions
    & { readonly color: string; };
type TextPdfOptions =
    & TextOptions
    & { readonly color: Color; };
export type TextCanvasElement = {
    readonly options: TextCanvasOptions;
    readonly pageIndex: number;
    readonly text: string;
};
export type TextPdfElement = {
    readonly options: TextPdfOptions;
    readonly pageIndex: number;
    readonly text: string;
}
export type CanvasElement =
    | { type: DRAWING_TYPES.PATH; element: PathCanvasElement; }
    | { type: DRAWING_TYPES.RECTANGLE; element: RectangleCanvasElement; }
    | { type: DRAWING_TYPES.TEXT; element: TextCanvasElement; };

export type PdfElement =
    | { type: DRAWING_TYPES.PATH; element: PathPdfElement; }
    | { type: DRAWING_TYPES.RECTANGLE; element: RectanglePdfElement; }
    | { type: DRAWING_TYPES.TEXT; element: TextPdfElement; };

export type NoteElement = {
    readonly height: number;
    readonly noteId: string;
    readonly pageIndex: number;
    readonly x: number;
    readonly y: number;
    readonly width: number;
};
export type NoteReferenceElement = {
    type: REFERENCE_TYPES.NOTE;
    element: NoteElement;
};
export type ReferenceElement =
    | NoteReferenceElement;
