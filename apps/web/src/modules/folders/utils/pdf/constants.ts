import { PdfFileElements } from "../../types";

export const ANNOTATION_SCALE = .6 as const;
export const FILE_ELEMENTS: PdfFileElements = {
    canvasElements: [],
    pdfElements : [],
    references: [],
};
export const FIRST_PAGE = 1 as const;
export const HIGLIGHT_OPACITY = 0.25 as const;
export const PDF_TYPE = { type: "application/pdf" } as const;
export const REGULAR_OPACITY = 1 as const;
export const STROKE_SIZE = 2 as const;
