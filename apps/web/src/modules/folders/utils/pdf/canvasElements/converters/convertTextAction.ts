import { getRgbColor } from "@/utils";

import { ANNOTATION_SCALE, TextCanvasElement, TextElementAction } from "../../../../contexts";

export const convertTextAction = (
    action: TextElementAction,
    containerDimensions: DOMRect,
): TextCanvasElement => {
    const { rect, color, pageIndex, text } = action.element;

    const options = {
        size: rect.height * ANNOTATION_SCALE,
        color: getRgbColor(color),
        x: rect.left - containerDimensions.left,
        y: rect.top - containerDimensions.top - 3,
    };

    return ({
        options,
        pageIndex,
        text,
    });
};
