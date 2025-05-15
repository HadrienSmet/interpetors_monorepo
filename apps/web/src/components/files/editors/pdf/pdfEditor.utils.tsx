import { RefObject } from "react";
import { TFunction } from "i18next";
import { PDFDocument, rgb } from "pdf-lib";

import { RgbColor } from "@/components/ui";

import { PdfEditorToolsState, TOOLS_ON_SELECTION } from "./pdfTools";

export type ActionItem = {
    readonly icon: React.JSX.Element,
    readonly onClick: () => void;
};
export type PageRefs = Array<HTMLCanvasElement | undefined>;

export const getContextMenuItem = (tool: TOOLS_ON_SELECTION, actionItem: ActionItem, t: TFunction<"translation", undefined>) => (
    <>
        {actionItem.icon}
        <p>{t(`views.new.context-menu.editor.${tool}`)}</p>
    </>
);
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
type UpdatePdfPageParams = {
    readonly pageRefs: RefObject<PageRefs>;
    readonly pdfDoc: PDFDocument;
    readonly pdfTools: PdfEditorToolsState;
    readonly rect: DOMRect;
};
export const updatePdfPage = ({ pageRefs, pdfDoc, pdfTools, rect }: UpdatePdfPageParams) => {
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

    // Getting the scale of the page
    const scaleFactor = pageRef.clientWidth / pdfWidth;

    const x = (rect.left - pageRef.getBoundingClientRect().left) / scaleFactor;
    const y = pdfHeight - ((rect.bottom - pageRef.getBoundingClientRect().top) / scaleFactor);

    page.drawRectangle({
        x,
        y,
        width: rect.width / scaleFactor,
        height: 2,
        color: rgb(pdfTools.color.r, pdfTools.color.g, pdfTools.color.b),
    });
};
