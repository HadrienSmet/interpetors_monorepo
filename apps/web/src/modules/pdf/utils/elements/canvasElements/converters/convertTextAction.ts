import { TextCanvasElement } from "@repo/types";

import { ANNOTATION_SCALE, TextAction } from "@/modules/files";
import { getRgbColor } from "@/utils";

export const convertTextAction = (action: TextAction): TextCanvasElement => {
    const { color, pageDimensions, rect, text } = action.element;

    const options = {
        color: getRgbColor(color),
        size: rect.height * ANNOTATION_SCALE,
        x: rect.left + rect.width - pageDimensions.left - 1,
        y: rect.top - pageDimensions.top + (rect.height * .3),
    };

    return ({
        options,
        text,
    });
};
