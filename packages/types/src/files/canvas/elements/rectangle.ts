import { CanvasColor } from "../../../colors";
import { RectangleElement } from "../../../common";

export type RectangleCanvasElement =
    & RectangleElement
    & { readonly color: CanvasColor; };
