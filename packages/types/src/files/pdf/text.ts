import { PdfColor } from "../../colors";
import { TextOptions } from "../../common";

export type TextPdfOptions =
    & TextOptions
    & { readonly color: PdfColor; };
export type TextPdfElement = {
    readonly options: TextPdfOptions;
    readonly text: string;
};
