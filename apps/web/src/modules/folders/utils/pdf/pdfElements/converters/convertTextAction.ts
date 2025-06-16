import { ANNOTATION_SCALE, TextElementAction, TextPdfElement } from "../../../../contexts";

import { getPdfRgbColor } from "./tools";

export const convertTextAction = (action: TextElementAction): TextPdfElement => {
    const { color, pageDimensions, pageIndex, pdfDoc, rect, text } = action.element;

    const page = pdfDoc.getPage(pageIndex - 1);
    const { width: pageWidth, height: pageHeight } = page.getSize();

    const scaleFactor = pageDimensions.width / pageWidth;
    const scale = (value: number) => value / scaleFactor;

    const size = scale(rect.height * ANNOTATION_SCALE);
    const width = scale(rect.width);
    const x = scale(rect.left - pageDimensions.left) + width - scale(1.5);
    const y = (pageHeight - scale(rect.bottom - pageDimensions.top)) + scale(size);

    const options = {
        color: getPdfRgbColor(color),
        size,
        x,
        y,
    };

    return ({
        options,
        pageIndex,
        text,
    });
};
