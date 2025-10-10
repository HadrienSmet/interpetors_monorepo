import { FILE_TOOLS, RectAction } from "@repo/types";

import { ColorPanelType } from "@/modules/colorPanel";
import { HIGLIGHT_OPACITY, REGULAR_OPACITY, STROKE_SIZE } from "@/modules/files";
import { getPdfDocument } from "@/modules/folders";
import { getPdfRgbColor, handleActionColor } from "@/utils";

import { RectPdfElement } from "../types";

export const convertRectAction = async (action: RectAction, colorPanel : ColorPanelType | null): Promise<Array<RectPdfElement>> => {
    const { color: actionColor, pageDimensions, pageIndex, file, rectsArray, tool } = action.element;

    const isHighlight = (
        tool === FILE_TOOLS.HIGHLIGHT ||
        tool === FILE_TOOLS.VOCABULARY
    );
    const pdfDoc = await getPdfDocument(file);
    const opacity = isHighlight
        ? HIGLIGHT_OPACITY
        : REGULAR_OPACITY;
    const rgbColor = handleActionColor(actionColor, colorPanel);
    const color = getPdfRgbColor(rgbColor);

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
                color,
                height,
                opacity,
                width,
                x,
                y,
            });
        })
    );
};
