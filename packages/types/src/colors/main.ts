import { Color } from "pdf-lib";

/** Each value is included in 0-1 range */
export type RgbColor = {
    readonly r: number;
    readonly g: number;
    readonly b: number;
};
/** Each value is included in 0-255 range */
export type SplittedRgb = {
    readonly r: number;
    readonly g: number;
    readonly b: number;
};

export enum ColorKind {
    INLINE = "INLINE",
    PANEL = "PANEL",
}
type ActionInlineColor = {
    readonly kind: ColorKind.INLINE;
    readonly value: RgbColor;
};
type CanvasInlineColor = {
    readonly kind: ColorKind.INLINE;
    readonly value: string;
};
type PdfInlineColor = {
    readonly kind: ColorKind.INLINE;
    readonly value: Color;
};
type PanelColor = {
    readonly kind: ColorKind.PANEL;
    readonly value: string;
};
export type ActionColor =
    | ActionInlineColor
    | PanelColor;
export type PdfColor =
    | PdfInlineColor
    | PanelColor;
export type CanvasColor =
    | CanvasInlineColor
    | PanelColor;
