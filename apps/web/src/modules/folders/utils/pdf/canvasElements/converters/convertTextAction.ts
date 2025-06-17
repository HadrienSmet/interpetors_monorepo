import { getRgbColor } from "@/utils";

import { ANNOTATION_SCALE, TextCanvasElement, TextElementAction } from "../../../../contexts";

export const convertTextAction = (action: TextElementAction): TextCanvasElement => {
    const { color, pageDimensions, pageIndex, rect, text } = action.element;

    const options = {
        size: rect.height * ANNOTATION_SCALE,
        color: getRgbColor(color),
        x: rect.left - pageDimensions.left,
        y: rect.top - pageDimensions.top - 3,
    };

    return ({
        options,
        pageIndex,
        text,
    });
};
