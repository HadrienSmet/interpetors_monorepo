import { DRAWING_TYPES, ElementAction } from "@repo/types";

import { ColorPanelType } from "@/modules/colorPanel";

import { convertPathAction, convertRectAction, convertTextAction } from "./converters";
import { PdfElement } from "./types";

type GetPdfElementsParams = {
    readonly colorPanel: ColorPanelType | null;
    readonly typedElement: ElementAction;
};
export const getPdfElements = async ({ colorPanel, typedElement }: GetPdfElementsParams) => {
    let pdfElements: Array<PdfElement> = [];

    switch (typedElement.type) {
        case DRAWING_TYPES.PATH:
            const pathElement = await convertPathAction(typedElement, colorPanel);

            pdfElements.push({ type: typedElement.type, element: pathElement })
            break;
        case DRAWING_TYPES.RECT:
            const rectangles = await convertRectAction(typedElement, colorPanel);

            pdfElements = rectangles.map(element => ({ type: typedElement.type, element }));
            break;
        case DRAWING_TYPES.TEXT:
            const text = await convertTextAction(typedElement, colorPanel);

            pdfElements.push({ type: typedElement.type, element: text });
            break;
    }

    return (pdfElements);
};
