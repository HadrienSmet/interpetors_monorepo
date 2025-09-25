import { Color } from "pdf-lib";

import { TextOptions } from "../../common";

export type TextPdfOptions =
    & TextOptions
    & { readonly color: Color; };
export type TextPdfElement = {
    readonly options: TextPdfOptions;
    readonly text: string;
};
