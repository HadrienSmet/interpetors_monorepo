import { TextAction } from "@repo/types";

import { ColorPanelType } from "@/modules/colorPanel";
import { ANNOTATION_SCALE } from "@/modules/files";
import { getRgbColor, handleActionColor } from "@/utils";

import { TextCanvasElement } from "../types";

export const convertTextAction = (action: TextAction, colorPanel: ColorPanelType | null): TextCanvasElement => {
    const { color: actionColor, pageDimensions, rect, text } = action.element;

    const rgbColor = handleActionColor(actionColor, colorPanel);
    const color = getRgbColor(rgbColor);

    const options = {
        color,
        size: rect.height * ANNOTATION_SCALE,
        x: rect.left + rect.width - pageDimensions.left - 1,
        y: rect.top - pageDimensions.top + (rect.height * .3),
    };

    return ({
        options,
        text,
    });
};
