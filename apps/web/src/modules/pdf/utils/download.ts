import { PDFDocument, PDFPage } from "pdf-lib";

import { ClientPdfFile, DRAWING_TYPES, PathPdfElement, RectanglePdfElement, TextPdfElement } from "@repo/types";

import { PDF_TYPE } from "./const";

const drawPath = (element: PathPdfElement, page: PDFPage) => {
    page.drawSvgPath(element.path, element.options);
};
const drawRectangle = (element: RectanglePdfElement, page: PDFPage) => {
    page.drawRectangle(element);
};
const drawText = (element: TextPdfElement, page: PDFPage) => {
    page.drawText(element.text, element.options);
};

export const applyChangesOnFile = (file: ClientPdfFile, pdfDoc: PDFDocument, numPages: number) => {
    for (let i = 0; i < numPages; i++) {
        const { pdfElements } = file.elements[i + 1];
        const page = pdfDoc.getPage(i);
        if (!page) {
            continue;
        }

        for (const pdfElement of pdfElements) {
            switch (pdfElement.type) {
                case DRAWING_TYPES.PATH:
                    drawPath(pdfElement.element, page);
                    break;
                case DRAWING_TYPES.RECTANGLE:
                    drawRectangle(pdfElement.element, page);
                    break;
                case DRAWING_TYPES.TEXT:
                    drawText(pdfElement.element, page);
                    break;
            }
        }
    }
};
const removeDynamicElements = (pdfFile: ClientPdfFile) => {
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
export const getCleanedAndUpdatedFile = async (pdfDoc: PDFDocument, pdfFile: ClientPdfFile): Promise<ClientPdfFile> => {
    const updatedBytes = await pdfDoc.save();

    const updatedBlob = new Blob([new Uint8Array(updatedBytes)], PDF_TYPE);
    const updatedFile = new File([updatedBlob], pdfFile.name, PDF_TYPE);

    const cleanedFileInStructure = removeDynamicElements(pdfFile);

    return ({
        ...cleanedFileInStructure,
        file: updatedFile,
    });
};

export const handleSaveChanges = async (file: ClientPdfFile, pdfDoc: PDFDocument, numPages: number) => {
    applyChangesOnFile(file, pdfDoc, numPages);

    const cleanedAndUpdated = await getCleanedAndUpdatedFile(pdfDoc, file);

    return (cleanedAndUpdated);
};

/**
 * Dowloads an updated pdf file
 * @param pdfDoc Instance of PDFDocument
 * @param filename Name of the file to download
 */
export const downloadPdf = async (pdfDoc: PDFDocument, filename = "document.pdf") => {
    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([new Uint8Array(pdfBytes)], PDF_TYPE);

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `updated_${filename}`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
