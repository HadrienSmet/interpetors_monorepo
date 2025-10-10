import { PathAction } from "@repo/types";

import { ColorPanelType } from "@/modules/colorPanel";
import { REGULAR_OPACITY, STROKE_SIZE } from "@/modules/files";
import { getPdfDocument } from "@/modules/folders";
import { getPdfRgbColor, handleActionColor } from "@/utils";

import { PathPdfElement, PathPdfOptions } from "../types";

export const convertPathAction = async (action: PathAction, colorPanel: ColorPanelType | null): Promise<PathPdfElement> => {
    const { color: actionColor, file, pageDimensions, pageIndex, points } = action.element;

    const rgbColor = handleActionColor(actionColor, colorPanel);
    const borderColor = getPdfRgbColor(rgbColor);

    const pdfDoc = await getPdfDocument(file);
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

    const options: PathPdfOptions = {
        borderColor,
        borderWidth: STROKE_SIZE,
        opacity: REGULAR_OPACITY,
        x: minX,
        y: pageHeight - minY,
    };

    return ({
        path,
        options,
    });
};
