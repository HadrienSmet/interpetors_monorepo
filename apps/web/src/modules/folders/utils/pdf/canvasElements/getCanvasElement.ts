import { RefObject } from "react";

import { CanvasElement, DRAWING_TYPES, ElementAction, RectangleCanvasElement } from "../../../contexts";

import { convertRectangleAction, convertTextAction } from "./converters";

type GetCanvasElementsParams =
    & ElementAction
    & { readonly containerRef: RefObject<HTMLDivElement | null>; };
export const getCanvasElements = ({ containerRef, element, type }: GetCanvasElementsParams) => {
    let canvasElements: Array<CanvasElement> = [];
    if (!containerRef.current) {
        return (canvasElements);
    }

    switch (type) {
        case DRAWING_TYPES.RECTANGLE:
            const rectangles: Array<RectangleCanvasElement> = convertRectangleAction({ element, type });
            canvasElements = rectangles.map(element => ({
                type,
                element,
            }));
            break;
        case DRAWING_TYPES.TEXT:
            const text = convertTextAction({ element, type });
            canvasElements.push({ type, element: text });
            break;
    }

    return (canvasElements);
};
