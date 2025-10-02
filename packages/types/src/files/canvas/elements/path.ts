import { CanvasColor } from "../../../colors";
import { Position } from "../../../common";

export type PathCanvasElement = {
    readonly color: CanvasColor;
    readonly points: Array<Position>;
};
