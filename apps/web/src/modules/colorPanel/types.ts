export type ColorSwatch = {
    readonly id: string;
    readonly name: string;
    readonly value: string;
};
export type ColorPanelType = {
    readonly colors: Array<ColorSwatch>;
    readonly id: string;
    readonly name: string;
};
export type ColorPanelInCreation = {
    readonly colors: Array<Omit<ColorSwatch, "id">>;
    readonly name: string | undefined;
};
