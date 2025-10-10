import { DRAWING_TYPES, Position, TypedElement } from "../../common";

import { FileTool } from "../tools";

import { ActionElementBase } from "./common";

export type PathActionElement =
    & ActionElementBase
    & { readonly points: Array<Position>; };
export type RectActionElement =
    & ActionElementBase
    & {
        readonly rectsArray: Array<DOMRect>;
        readonly tool: FileTool;
    };
export type TextActionElement =
    & ActionElementBase
    & {
        readonly rect: DOMRect;
        readonly text: string;
    };

export type PathAction = TypedElement<DRAWING_TYPES.PATH, PathActionElement>;
export type RectAction = TypedElement<DRAWING_TYPES.RECT, RectActionElement>;
export type TextAction = TypedElement<DRAWING_TYPES.TEXT, TextActionElement>;
export type ElementAction =
    | PathAction
    | RectAction
    | TextAction;
