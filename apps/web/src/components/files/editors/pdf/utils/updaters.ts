import { NoteInStructure, PathToDraw, RectangleToDraw, TextToDraw } from "@/contexts";
import { Position } from "@/types";

import { PDF_TOOLS } from "../pdfTools";

import { HIGLIGHT_OPACITY, REGULAR_OPACITY, STROKE_SIZE } from "./constants";
import { findPointPage, findRectPage } from "./finders";
import { getPdfColor } from "./getters";
import { UpdatePdfDocumentParams } from "./types";

type UpdatePdfOnSelectionOutput = {
    readonly rectangleToDraw: RectangleToDraw;

    noteReference?: NoteInStructure;
    textToDraw?: TextToDraw;
};
type UpdatePdfDocumentOnSelectionParams =
    & UpdatePdfDocumentParams
    & {
        readonly rect: DOMRect;
        readonly refToAdd?: string;
        readonly noteId?: string;
    };
export const updatePdfDocumentOnSelection = ({
    noteId,
    pageRefs,
    pdfDoc,
    pdfTools,
    rect,
    refToAdd,
}: UpdatePdfDocumentOnSelectionParams): UpdatePdfOnSelectionOutput | undefined => {
    const pageRef = pageRefs.current.find(ref => findRectPage(ref, rect));

    if (!pageRef) return;

    const shouldHighlightText = (
        pdfTools.tool === PDF_TOOLS.HIGHLIGHT ||
        pdfTools.tool === PDF_TOOLS.VOCABULARY
    );

    const pageIndex = pageRefs.current.indexOf(pageRef);
    console.log({ pageIndex })
    const page = pdfDoc.getPage(pageIndex);

    const { width: pdfWidth, height: pdfHeight } = page.getSize();
    const { top: pageTop, left: pageLeft } = pageRef.getBoundingClientRect();

    // Getting the scale of the page
    const scaleFactor = pageRef.clientWidth / pdfWidth;
    const getFactoredValue = (value: number): number => (value / scaleFactor);

    const color = getPdfColor(pdfTools.color);
    const height = shouldHighlightText
        ? getFactoredValue(rect.height)
        : getFactoredValue(STROKE_SIZE);
    const opacity = shouldHighlightText
        ? HIGLIGHT_OPACITY
        : REGULAR_OPACITY;
    const x = getFactoredValue(rect.left - pageLeft);
    const y = pdfHeight - getFactoredValue(rect.bottom - pageTop);
    const width = getFactoredValue(rect.width);

    const rectangleToDraw: Omit<RectangleToDraw, "pageIndex"> = {
        color,
        height,
        opacity,
        width,
        x,
        y,
    };

    const output: UpdatePdfOnSelectionOutput = {
        rectangleToDraw: { ...rectangleToDraw, pageIndex },
    };

    page.drawRectangle(rectangleToDraw);

    if (refToAdd) {
        const textToDraw: TextToDraw = {
            options: {
                color: getPdfColor(pdfTools.color),
                size: getFactoredValue(rect.height * .6),
                x: x + width - getFactoredValue(1.5),
                y: y + getFactoredValue(rect.height * .6),
            },
            pageIndex,
            text: refToAdd,
        };

        page.drawText(
            textToDraw.text,
            textToDraw.options
        );

        output.textToDraw = textToDraw;
    }

    if (pdfTools.tool === PDF_TOOLS.NOTE && noteId) {
        output.noteReference = {
            height: rect.height,
            noteId,
            pageIndex,
            width: rect.width,
            x: rect.left - pageRef.getBoundingClientRect().left,
            y: rect.top - pageTop,
        };
    }

    return (output);
};

type UpdatePdfDocumentOnStrokeParams =
    & UpdatePdfDocumentParams
    & { readonly points: Array<Position>; };
export const updatePdfDocumentOnStroke = ({
    pageRefs,
    pdfDoc,
    pdfTools,
    points,
}: UpdatePdfDocumentOnStrokeParams): PathToDraw | undefined => {
    const pageRef = pageRefs.current.find(ref => findPointPage(ref, points));

    if (!pageRef) return;

    const pageIndex = pageRefs.current.indexOf(pageRef);
    console.log({pageIndex })
    const page = pdfDoc.getPage(pageIndex);
    const { height: pdfHeight, width: pdfWidth } = page.getSize();

    const scaleFactor = pageRef.clientWidth / pdfWidth;

    const { left: pageLeft, top: pageTop } = pageRef.getBoundingClientRect();

    const minX = Math.min(...points.map(p => (p.x - pageLeft) / scaleFactor));
    const minY = Math.min(...points.map(p => (p.y - pageTop) / scaleFactor));

    const path = points
        .map((point, index) => {
            const x = (point.x - pageLeft) / scaleFactor - minX;
            const y = (point.y - pageTop) / scaleFactor - minY;

            return (
                index === 0
                    ? `M ${x},${y}`
                    : `L ${x},${y}`
            );
        })
        .join(" ");

    const output: PathToDraw = {
        pageIndex,
        path,
        options: {
            borderColor: getPdfColor(pdfTools.color),
            borderWidth: STROKE_SIZE,
            opacity: REGULAR_OPACITY,
            x: minX,
            y: pdfHeight - minY,
        },
    };

    page.drawSvgPath(
        output.path,
        output.options,
    );

    return (output);
};
