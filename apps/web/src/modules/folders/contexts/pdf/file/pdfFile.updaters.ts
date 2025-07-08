import { PDFDocument, PDFPage } from "pdf-lib";

import { PathPdfElement, PdfFileInStructure, RectanglePdfElement, TextPdfElement } from "../../../types";
import { PDF_TYPE } from "../../../utils";

export const drawPath = (element: PathPdfElement, page: PDFPage) => {
    page.drawSvgPath(element.path, element.options);
};
export const drawRectangle = (element: RectanglePdfElement, page: PDFPage) => {
    page.drawRectangle(element);
};
export const drawText = (element: TextPdfElement, page: PDFPage) => {
    page.drawText(element.text, element.options);
};
export const updateFileFromPdfDocument = async (pdfDoc: PDFDocument, pdfFile: PdfFileInStructure): Promise<PdfFileInStructure> => {
    const updatedBytes = await pdfDoc.save();

    const updatedBlob = new Blob([updatedBytes], PDF_TYPE);
    const updatedFile = new File([updatedBlob], pdfFile.name, PDF_TYPE);

    const removeDynamicElements = () => {
        const copy = { ...pdfFile };

        for (const key in copy.elements) {
            copy.elements[key] = {
                ...copy.elements[key],
                canvasElements: [],
                pdfElements: [],
            };
        }

        return (copy);
    };

    const cleanedFileInStructure = removeDynamicElements();

    return ({
        ...cleanedFileInStructure,
        file: updatedFile,
    });
};
