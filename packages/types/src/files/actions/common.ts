import { ActionColor } from "../../colors";

export type ActionElementBase = {
    readonly color: ActionColor;
    readonly pageDimensions: DOMRect;
    readonly pageIndex: number;
    readonly file: File;
};
