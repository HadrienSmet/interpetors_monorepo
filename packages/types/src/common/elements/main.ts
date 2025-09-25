export enum DRAWING_TYPES {
    PATH = "path",
    RECTANGLE = "rectangle",
    TEXT = "text",
}

export type RectangleElement = {
    readonly height: number;
    readonly width: number;
    readonly x: number;
    readonly y: number;
};
export type TextOptions = {
    readonly size: number;
    readonly x: number;
    readonly y: number;
};
