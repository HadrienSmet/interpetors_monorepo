import { PDFDocument, PDFPage, PDFPageDrawRectangleOptions, PDFPageDrawSVGOptions, PDFPageDrawTextOptions } from "pdf-lib";

import { DRAWING_TYPES, PdfFile } from "@repo/types";

import { ColorPanelType } from "@/modules/colorPanel";

import { PDF_TYPE } from "./const";
import { getPdfElements } from "./elements";

type DrawPathParams = {
    readonly path: string;
    readonly options: PDFPageDrawSVGOptions;
};
const drawPath = (params: DrawPathParams, page: PDFPage) => {
    page.drawSvgPath(params.path, params.options);
};
const drawRect = (params: PDFPageDrawRectangleOptions, page: PDFPage) => {
    page.drawRectangle(params);
};
type DrawTextParams = {
    readonly text: string;
    readonly options: PDFPageDrawTextOptions;
};
const drawText = (params: DrawTextParams, page: PDFPage) => {
    page.drawText(params.text, params.options);
};

export const applyChangesOnFile = async (file: PdfFile, pdfDoc: PDFDocument, numPages: number, colorPanel: ColorPanelType | null) => {
    for (let i = 0; i < numPages; i++) {
        const pdfElements = [];
        for (const element of file.actions[i+1].elements) {
            const response = await getPdfElements({ typedElement: element, colorPanel });
            pdfElements.push(...response);
        }

        const page = pdfDoc.getPage(i);
        if (!page) continue;

        for (const pdfElement of pdfElements) {
            switch (pdfElement.type) {
                case DRAWING_TYPES.PATH:
                    drawPath(pdfElement.element, page);
                    break;
                case DRAWING_TYPES.RECT:
                    drawRect(pdfElement.element, page);
                    break;
                case DRAWING_TYPES.TEXT:
                    drawText(pdfElement.element, page);
                    break;
            }
        }
    }
};
export const getUpdatedFile = async (pdfDoc: PDFDocument, pdfFile: PdfFile): Promise<PdfFile> => {
    const updatedBytes = await pdfDoc.save();

    const updatedBlob = new Blob([new Uint8Array(updatedBytes)], PDF_TYPE);
    const updatedFile = new File([updatedBlob], pdfFile.name, PDF_TYPE);

    return ({
        ...pdfFile,
        file: updatedFile,
    });
};

export const handleSaveChanges = async (file: PdfFile, pdfDoc: PDFDocument, numPages: number, colorPanel: ColorPanelType | null) => {
    await applyChangesOnFile(file, pdfDoc, numPages, colorPanel);

    const updated = await getUpdatedFile(pdfDoc, file);

    return (updated);
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
