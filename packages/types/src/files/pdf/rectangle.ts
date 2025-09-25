import { Color } from "pdf-lib";

import { RectangleElement } from "../../common";

export type RectanglePdfElement =
    & RectangleElement
    & {
        readonly color: Color;
        readonly opacity: number;
    };
