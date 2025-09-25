import { RectanglePdfElement } from "@repo/types";

import { HIGLIGHT_OPACITY, RectangleAction, REGULAR_OPACITY, STROKE_SIZE } from "@/modules/files";

import { PDF_TOOLS } from "../../../../types";

import { getPdfRgbColor } from "./tools";

export const convertRectangleAction = (action: RectangleAction): Array<RectanglePdfElement> => {
    const { color, pageDimensions, pageIndex, pdfDoc, rectsArray, tool } = action.element;

    const isHighlight = (
        tool === PDF_TOOLS.HIGHLIGHT ||
        tool === PDF_TOOLS.VOCABULARY
    );
    const opacity = isHighlight
        ? HIGLIGHT_OPACITY
        : REGULAR_OPACITY;
    const pdfColor = getPdfRgbColor(color);

    return (
        rectsArray.map(rect => {
            const page = pdfDoc.getPage(pageIndex - 1);
            const { width: pageWidth, height: pageHeight } = page.getSize();

            const scaleFactor = pageDimensions.width / pageWidth;
            const scale = (value: number) => value / scaleFactor;

            const height = isHighlight
                ? scale(rect.height)
                : scale(STROKE_SIZE);
            const width = scale(rect.width);
            const x = scale(rect.left - pageDimensions.left);
            const y = pageHeight - scale(rect.bottom - pageDimensions.top);

            return ({
                color: pdfColor,
                height,
                opacity,
                width,
                x,
                y,
            });
        })
    );
};
