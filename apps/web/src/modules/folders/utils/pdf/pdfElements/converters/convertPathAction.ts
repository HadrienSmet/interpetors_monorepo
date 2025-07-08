import { PathAction, PathPdfElement } from "../../../../types";
import { STROKE_SIZE, REGULAR_OPACITY } from "../../../../utils";

import { getPdfRgbColor } from "./tools";

export const convertPathAction = (action: PathAction): PathPdfElement => {
    const { color, pageDimensions, pageIndex, pdfDoc, points } = action.element;

    const pdfColor = getPdfRgbColor(color);
    const page = pdfDoc.getPage(pageIndex - 1);
    const { width: pageWidth, height: pageHeight } = page.getSize();

    const scaleFactor = pageDimensions.width / pageWidth;

    const convertX = (x: number) => (x - pageDimensions.left) / scaleFactor;
    const convertY = (y: number) => (y - pageDimensions.top) / scaleFactor;

    const convertedPoints = points.map(p => ({
        x: convertX(p.x),
        y: convertY(p.y),
    }));

    const minX = Math.min(...convertedPoints.map(p => p.x));
    const minY = Math.min(...convertedPoints.map(p => p.y));

    const path = convertedPoints
        .map(({ x, y }, index) => index === 0
            ? `M ${x - minX},${y - minY}`
            : `L ${x - minX},${y - minY}`
        )
        .join(" ");

    const options = {
        borderColor: pdfColor,
        borderWidth: STROKE_SIZE,
        opacity: REGULAR_OPACITY,
        x: minX,
        y: pageHeight - minY,
    };

    return ({
        pageIndex,
        path,
        options,
    });
};
