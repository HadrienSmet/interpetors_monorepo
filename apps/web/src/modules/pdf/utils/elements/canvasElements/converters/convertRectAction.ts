import { FILE_TOOLS, RectAction } from "@repo/types";

import { ColorPanelType } from "@/modules/colorPanel";
import { HIGLIGHT_OPACITY, REGULAR_OPACITY, STROKE_SIZE } from "@/modules/files";
import { handleActionColor, rgbToRgba } from "@/utils";

import { RectCanvasElement } from "../types";

export const convertRectAction = (action: RectAction, colorPanel: ColorPanelType | null): Array<RectCanvasElement> => {
    const { color: elementColor, pageDimensions, rectsArray, tool } = action.element;

    const isHighlight = (
        tool === FILE_TOOLS.HIGHLIGHT ||
        tool === FILE_TOOLS.VOCABULARY
    );

    return (
        rectsArray.map(rect => {
            const height = isHighlight
                ? rect.height
                : STROKE_SIZE;
            const opacity = isHighlight
                ? HIGLIGHT_OPACITY
                : REGULAR_OPACITY;
            const rgbColor = handleActionColor(elementColor, colorPanel);
            const color = rgbToRgba(rgbColor, opacity);
            const x = rect.left - pageDimensions.left;
            const y = isHighlight
                ? rect.top - pageDimensions.top
                : rect.top + rect.height - height - pageDimensions.top;
            const width = rect.width;

            return ({
                color,
                height,
                opacity: opacity,
                width,
                x,
                y,
            });
        })
    );
};
