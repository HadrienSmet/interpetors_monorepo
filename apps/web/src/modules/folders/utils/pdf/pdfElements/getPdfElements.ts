import { DRAWING_TYPES, ElementAction, PdfElement } from "../../../contexts";

import { convertRectangleAction, convertTextAction } from "./converters";

export const getPdfElements = ({ element, type }: ElementAction) => {
    let pdfElements: Array<PdfElement> = [];

    switch (type) {
        case DRAWING_TYPES.RECTANGLE:
            const rectangles = convertRectangleAction({ element, type });

            pdfElements = rectangles.map(element => ({ type, element }));
            break;
        case DRAWING_TYPES.TEXT:
            const text = convertTextAction({ element, type });

            pdfElements.push({ type, element: text });
            break;
    }

    return (pdfElements);
};
