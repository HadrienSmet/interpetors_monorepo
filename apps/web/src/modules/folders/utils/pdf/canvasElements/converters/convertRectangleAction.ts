import { rgbToRgba } from "@/utils/colors";

import { PDF_TOOLS, RectangleCanvasElement, RectangleAction, } from "../../../../types";

import {
    HIGLIGHT_OPACITY,
    REGULAR_OPACITY,
    STROKE_SIZE,
} from "../../constants";

export const convertRectangleAction = (action: RectangleAction): Array<RectangleCanvasElement> => {
    const { color, pageDimensions, pageIndex, rectsArray, tool } = action.element;

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
            const x = rect.left - pageDimensions.left;
            const y = isHighlight
                ? rect.top - pageDimensions.top
                : rect.top + rect.height - height - pageDimensions.top;
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
