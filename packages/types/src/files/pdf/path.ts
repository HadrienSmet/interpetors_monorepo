import { Color } from "pdf-lib";

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
