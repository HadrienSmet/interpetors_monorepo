import { PdfColor } from "../../colors";
import { RectangleElement } from "../../common";

export type RectanglePdfElement =
    & RectangleElement
    & {
        readonly color: PdfColor;
        readonly opacity: number;
    };
