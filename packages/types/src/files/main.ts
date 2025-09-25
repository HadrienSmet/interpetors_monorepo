import { Note } from "../notes";

import { CanvasElement } from "./canvas";
import { PdfElement } from "./pdf";
import { ReferenceElement } from "./references";

export type PdfFileElements = {
    /**
     * Used by the client to display the drawing in a canvas
     * List of user actions
     */
    readonly canvasElements: Array<CanvasElement>;
    /** List of the notes generated in marge of the file */
    readonly notes: Array<Note>;
    /** Used by the server to draw the elements on the original file and send it to the client */
    readonly pdfElements: Array<PdfElement>;
    /** Interactive elements used as bridges to parts of website */
    readonly references: Array<ReferenceElement>;
};
export type ClientPdfFile = {
    /** Page index indexed record */
    readonly elements: Record<number, PdfFileElements>;
    /** Only updated by the server */
    readonly file: File;
    /** Name of the file */
    readonly name: string;
};
export type ServerPdfFile = {
    readonly elements: Record<number, Omit<PdfFileElements, "canvasElements">>;
    /** Only updated by the server */
    readonly file: File;
    /** Name of the file */
    readonly name: string;
};
