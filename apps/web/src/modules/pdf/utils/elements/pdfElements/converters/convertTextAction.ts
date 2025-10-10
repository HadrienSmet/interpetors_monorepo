import { TextAction } from "@repo/types";

import { ColorPanelType } from "@/modules/colorPanel";
import { ANNOTATION_SCALE } from "@/modules/files";
import { getPdfDocument } from "@/modules/folders";
import { getPdfRgbColor, handleActionColor } from "@/utils";

import { TextPdfElement } from "../types";

export const convertTextAction = async (action: TextAction, colorPanel: ColorPanelType | null): Promise<TextPdfElement> => {
    const { color: actionColor, pageDimensions, pageIndex, file, rect, text } = action.element;

    const rgbColor = handleActionColor(actionColor, colorPanel);
    const color = getPdfRgbColor(rgbColor);

    const pdfDoc = await getPdfDocument(file);
    const page = pdfDoc.getPage(pageIndex - 1);
    const { width: pageWidth, height: pageHeight } = page.getSize();

    const scaleFactor = pageDimensions.width / pageWidth;
    const scale = (value: number) => value / scaleFactor;

    const size = scale(rect.height * ANNOTATION_SCALE);
    const width = scale(rect.width);
    const x = scale(rect.left - pageDimensions.left) + width - scale(1.5);
    const y = (pageHeight - scale(rect.bottom - pageDimensions.top)) + scale(size);

    const options = {
        color,
        size,
        x,
        y,
    };

    return ({
        options,
        text,
    });
};
