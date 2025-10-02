import { CanvasColor, ColorKind, RectangleCanvasElement } from "@repo/types";

import { HIGLIGHT_OPACITY, PDF_TOOLS, RectangleAction, REGULAR_OPACITY, STROKE_SIZE } from "@/modules/files";
import { rgbToRgba } from "@/utils/colors";

export const convertRectangleAction = (action: RectangleAction): Array<RectangleCanvasElement> => {
    const { color, pageDimensions, rectsArray, tool } = action.element;

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
            const colorToUse: CanvasColor = color.kind === ColorKind.PANEL
                ? color
                : {
                    kind: ColorKind.INLINE,
                    value: rgbToRgba(color.value, opacity),
                };
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
                opacity: opacity,
                color: colorToUse,
            });
        })
    );
};
