import { CanvasElement, DRAWING_TYPES, ElementAction, RectangleCanvasElement } from "../../../types";

import { convertRectangleAction, convertTextAction } from "./converters";

export const getCanvasElements = ({ element, type }: ElementAction) => {
    let canvasElements: Array<CanvasElement> = [];

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
