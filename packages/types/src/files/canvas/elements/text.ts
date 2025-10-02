import { CanvasColor } from "../../../colors";
import { TextOptions } from "../../../common";

type TextCanvasOptions =
    & TextOptions
    & { readonly color: CanvasColor; };
export type TextCanvasElement = {
    readonly options: TextCanvasOptions;
    readonly text: string;
};
