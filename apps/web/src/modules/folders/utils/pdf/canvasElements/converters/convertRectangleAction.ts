import { rgbToRgba } from "@/utils/colors";

import {
    HIGLIGHT_OPACITY,
    RectangleCanvasElement,
    RectangleElementAction,
    REGULAR_OPACITY,
    STROKE_SIZE,
} from "../../../../contexts";
import { PDF_TOOLS } from "../../../../types";

export const convertRectangleAction = (
    action: RectangleElementAction,
    containerDimensions: DOMRect
): Array<RectangleCanvasElement> => {
    const { rectsArray, color, pageIndex, tool } = action.element;

    const isHighlight = (
        tool === PDF_TOOLS.HIGHLIGHT ||
        tool === PDF_TOOLS.VOCABULARY
    );

    return (
        rectsArray.map(rect => {
            const height = isHighlight
                ? rect.height
                : STROKE_SIZE;
            const opacity = isHighlight
                ? HIGLIGHT_OPACITY
                : REGULAR_OPACITY;
            const x = rect.left - containerDimensions.left;
            const y = isHighlight
                ? rect.top - containerDimensions.top
                : rect.top + rect.height - height - containerDimensions.top;
            const width = rect.width;

            return ({
                x,
                y,
                width,
                height,
                pageIndex: pageIndex,
                opacity: REGULAR_OPACITY,
                color: rgbToRgba(color, opacity),
            });
        })
    );
};
