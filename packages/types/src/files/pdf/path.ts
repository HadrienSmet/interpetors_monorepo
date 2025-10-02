import { PdfColor } from "../../colors";

export type PathPdfOptions = {
    readonly borderColor: PdfColor;
    readonly borderWidth: number;
    readonly opacity: number;
    readonly x: number;
    readonly y: number;
};
export type PathPdfElement = {
    readonly options: PathPdfOptions;
    readonly path: string;
};
