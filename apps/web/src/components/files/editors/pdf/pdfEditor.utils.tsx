import { RefObject } from "react";
import { TFunction } from "i18next";
import { rgb } from "pdf-lib";

import { RgbColor } from "@/components/ui";
import { PDFDocument } from "@/workers/pdfConfig";

import { PDF_TOOLS, PdfEditorToolsState, TOOLS_ON_SELECTION } from "./pdfTools";

export type ActionItem = {
    readonly icon: React.JSX.Element,
    readonly onClick: () => void;
};
export type PageRefs = Array<HTMLCanvasElement | undefined>;

const HIGLIGHT_OPACITY = 0.25 as const;
const PDF_TYPE = { type: "application/pdf" } as const;
const REGULAR_OPACITY = 1 as const;
const UNDERLINE_HEIGHT = 2 as const;

export const getContextMenuItem = (tool: TOOLS_ON_SELECTION, actionItem: ActionItem, t: TFunction<"translation", undefined>) => (
    <>
        {actionItem.icon}
        <p>{t(`views.new.context-menu.editor.${tool}`)}</p>
    </>
);
export const getFileFromPdfDocument = async (pdfDoc: PDFDocument, pdfFile: File): Promise<File> => {
    const updatedBytes = await pdfDoc.save();

    const updatedBlob = new Blob([updatedBytes], PDF_TYPE);
    const updatedFile = new File([updatedBlob], pdfFile.name, PDF_TYPE);

    return (updatedFile);
}
export const getRange = () => {
    const selection = document.getSelection();
    if (!selection || selection.isCollapsed) {
        return;
    };

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText.trim()) {
        return;
    }

    return (range);
};
export const getRgbColor = (color: RgbColor) => `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`;
type UpdatePdfDocumentParams = {
    readonly pageRefs: RefObject<PageRefs>;
    readonly pdfDoc: PDFDocument;
    readonly pdfTools: PdfEditorToolsState;
    readonly rect: DOMRect;
};
export const updatePdfDocumentOnSelection = ({ pageRefs, pdfDoc, pdfTools, rect }: UpdatePdfDocumentParams) => {
    const pageRef = pageRefs.current.find(ref => {
        if (!ref) return (false);

        const { top, bottom } = ref.getBoundingClientRect();

        return (
            rect.top >= top &&
            rect.bottom <= bottom
        );
    });

    if (!pageRef) return;

    const pageIndex = pageRefs.current.indexOf(pageRef);
    const page = pdfDoc.getPage(pageIndex);
    const { width: pdfWidth, height: pdfHeight } = page.getSize();

    const getFactoredValue = (value: number): number => {
        // Getting the scale of the page
        const scaleFactor = pageRef.clientWidth / pdfWidth;

        return (value / scaleFactor);
    };

    const color = rgb(pdfTools.color.r, pdfTools.color.g, pdfTools.color.b);
    const height = pdfTools.tool === PDF_TOOLS.HIGHLIGHT
        ? getFactoredValue(rect.height)
        : getFactoredValue(UNDERLINE_HEIGHT);
    const opacity = pdfTools.tool === PDF_TOOLS.HIGHLIGHT
        ? HIGLIGHT_OPACITY
        : REGULAR_OPACITY;
    const x = getFactoredValue(rect.left - pageRef.getBoundingClientRect().left);
    const y = pdfHeight - getFactoredValue(rect.bottom - pageRef.getBoundingClientRect().top);
    const width = getFactoredValue(rect.width);

    page.drawRectangle({
        color,
        height,
        opacity,
        width,
        x,
        y,
    });
};
