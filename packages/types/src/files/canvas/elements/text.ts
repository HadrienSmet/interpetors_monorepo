import { TextOptions } from "../../../common";

type TextCanvasOptions =
    & TextOptions
    & { readonly color: string; };
export type TextCanvasElement = {
    readonly options: TextCanvasOptions;
    readonly text: string;
};
