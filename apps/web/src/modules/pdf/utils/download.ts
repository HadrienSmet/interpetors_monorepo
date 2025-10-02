import { PDFDocument, PDFPage, PDFPageDrawRectangleOptions, PDFPageDrawSVGOptions, PDFPageDrawTextOptions } from "pdf-lib";

import { ClientPdfFile, ColorKind, DRAWING_TYPES, PdfColor } from "@repo/types";

import { ColorPanelType } from "@/modules/colorPanel";
import { getRgbFromString } from "@/utils";

import { PDF_TYPE } from "./const";
import { getPdfRgbColor } from "./elements";

type DrawPathParams = {
    readonly path: string;
    readonly options: PDFPageDrawSVGOptions;
};
const drawPath = (params: DrawPathParams, page: PDFPage) => {
    page.drawSvgPath(params.path, params.options);
};
const drawRectangle = (params: PDFPageDrawRectangleOptions, page: PDFPage) => {
    page.drawRectangle(params);
};
type DrawTextParams = {
    readonly text: string;
    readonly options: PDFPageDrawTextOptions;
};
const drawText = (params: DrawTextParams, page: PDFPage) => {
    page.drawText(params.text, params.options);
};

export const applyChangesOnFile = (file: ClientPdfFile, pdfDoc: PDFDocument, numPages: number, colorPanel: ColorPanelType | null) => {
    const getColor = (pdfColor: PdfColor) => {
        if (pdfColor.kind === ColorKind.INLINE) {
            return (pdfColor.value);
        }

        const colorSwatch = colorPanel?.colors.find(clr => clr.id === pdfColor.value);
        if (!colorSwatch) {
            throw new Error("Should use lastValue");
        }

        return (getPdfRgbColor(getRgbFromString(colorSwatch.value)));
    };
    for (let i = 0; i < numPages; i++) {
        const { pdfElements } = file.elements[i + 1];
        const page = pdfDoc.getPage(i);
        if (!page) {
            continue;
        }

        for (const pdfElement of pdfElements) {
            let colorToUse;
            switch (pdfElement.type) {
                case DRAWING_TYPES.PATH:
                    colorToUse = getColor(pdfElement.element.options.borderColor);
                    drawPath({
                        ...pdfElement.element,
                        options: {
                            ...pdfElement.element.options,
                            borderColor: colorToUse,
                        }
                    }, page);
                    break;
                case DRAWING_TYPES.RECTANGLE:
                    colorToUse = getColor(pdfElement.element.color);
                    drawRectangle({ ...pdfElement.element, color: colorToUse }, page);
                    break;
                case DRAWING_TYPES.TEXT:
                    colorToUse = getColor(pdfElement.element.options.color);
                    drawText({
                        ...pdfElement.element,
                        options: {
                            ...pdfElement.element.options,
                            color: colorToUse,
                        },
                    }, page);
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

export const handleSaveChanges = async (file: ClientPdfFile, pdfDoc: PDFDocument, numPages: number, colorPanel: ColorPanelType | null) => {
    applyChangesOnFile(file, pdfDoc, numPages, colorPanel);

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
