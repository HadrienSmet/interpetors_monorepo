import { RefObject } from "react";
import { Color } from "pdf-lib";

import { Position } from "@/types";
import { RgbColor } from "@/utils";
import { PDFDocument } from "@/workers/pdfConfig";

import { PageRefs } from "../file";
import { PdfTool } from "../tools";

import { PdfFileInStructure } from "./file";

export enum DRAWING_TYPES {
    PATH = "path",
    RECTANGLE = "rectangle",
    TEXT = "text",
}
export enum REFERENCE_TYPES {
    NOTE = "note",
    VOCABULARY = "vocabulary",
}

type BaseElementAction = {
    readonly color: RgbColor;
    readonly pageRefs: RefObject<PageRefs>;
    readonly pdfDoc: PDFDocument;
    readonly pdfFile: PdfFileInStructure;
};
export type RectangleElementAction = {
    readonly type: DRAWING_TYPES.RECTANGLE;
    readonly element:
        & {
            readonly rectsArray: Array<DOMRect>;
            readonly tool: PdfTool;
        }
        & BaseElementAction;
};
export type TextElementAction = {
    readonly type: DRAWING_TYPES.TEXT;
    readonly element:
        & {
            readonly rect: DOMRect;
            readonly text: string;
        }
        & BaseElementAction;
};
export type ElementAction =
    | RectangleElementAction
    | TextElementAction;

type WithPageIndex = { readonly pageIndex: number; };
export type NoteInStructure =
    & {
        readonly height: number;
        readonly noteId: string;
        readonly pageIndex: number;
        readonly width: number;
    }
    & WithPageIndex
    & Position;
type PathCanvasElementOptions = {
    readonly borderColor: string;
    readonly borderWidth: number;
    readonly opacity: number;
};

export type PathCanvasElement =
    & {
        readonly options:
            & PathCanvasElementOptions
            & Position;
        readonly path: string;
    }
    & WithPageIndex;
export type PathPdfElement =
    & {
        readonly options:
            & Omit<PathCanvasElementOptions, "borderColor">
            & Position
            & { readonly borderColor: Color };
        readonly path: string;
    }
    & WithPageIndex;

type RectangleCanvasElementBase = {
    readonly color: string;
    readonly height: number;
    readonly opacity: number;
    readonly width: number;
};
export type RectangleCanvasElement =
    & RectangleCanvasElementBase
    & WithPageIndex
    & Position;
export type RectanglePdfElement =
    & Omit<RectangleCanvasElementBase, "color">
    & WithPageIndex
    & Position
    & { readonly color: Color };
type TextElementOptions = {
    readonly color: string;
    readonly size: number;
};
export type TextCanvasElement =
    & {
        readonly options:
            & TextElementOptions
            & Position;
        readonly text: string;
    }
    & WithPageIndex;
export type TextPdfElement =
    & {
        readonly options:
            & Omit<TextElementOptions, "color">
            & Position
            & { readonly color: Color; };
        readonly text: string;
    }
    & WithPageIndex;

export type CanvasElement =
    | { type: DRAWING_TYPES.PATH; element: PathCanvasElement; }
    | { type: DRAWING_TYPES.RECTANGLE; element: RectangleCanvasElement; }
    | { type: DRAWING_TYPES.TEXT; element: TextCanvasElement; };
export type PdfElement =
    | { type: DRAWING_TYPES.PATH; element: PathPdfElement; }
    | { type: DRAWING_TYPES.RECTANGLE; element: RectanglePdfElement; }
    | { type: DRAWING_TYPES.TEXT; element: RectanglePdfElement; };

type NoteAction = {
    readonly type: REFERENCE_TYPES.NOTE;
    readonly element: {
        readonly color: RgbColor;
        readonly noteId: string;
        readonly pageRefs: RefObject<PageRefs>;
        readonly pdfDoc: PDFDocument;
        readonly pdfFile: PdfFileInStructure;
        readonly rectsArray: Array<DOMRect>;
    };
};
export type ReferenceAction =
    | NoteAction;
export type ReferenceElement =
    | { readonly type: REFERENCE_TYPES.NOTE; readonly element: NoteInStructure; };
