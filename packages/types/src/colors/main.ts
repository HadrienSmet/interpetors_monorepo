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
type PanelColor = {
    readonly kind: ColorKind.PANEL;
    readonly value: string;
    readonly lastValue: string;
};
export type ActionColor =
    | ActionInlineColor
    | PanelColor;
