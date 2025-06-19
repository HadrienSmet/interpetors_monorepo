import { CanvasElement, PdfElement, ReferenceElement } from "./elements";

export type PdfFileElements = {
    /**
     * Used by the client to display the drawing in a canvas
     * List of user actions
     * */
    readonly canvasElements: Array<CanvasElement>;
    // TODO Should not be sent by the back-end. Only from client to server
    /** Used by the server to draw the elements on the original file and send it to the client */
    readonly pdfElements: Array<PdfElement>;
    /** Interactive elements used as bridges to parts of website */
    readonly references: Array<ReferenceElement>;
};
export type PdfFileInStructure = {
    readonly elements: Record<number, PdfFileElements>;
    /** Only updated by the server */
    readonly file: File;
    /** Name of the file */
    readonly name: string;
};
