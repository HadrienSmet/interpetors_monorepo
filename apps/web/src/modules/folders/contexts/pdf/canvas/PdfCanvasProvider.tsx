import { PropsWithChildren, useCallback, useEffect, useRef } from "react";

import { rgbToRgba } from "@/utils";

import { PDF_TOOLS } from "../../../types";

import { useFoldersManager } from "../../manager";

import { usePdfFile } from "../file";
import { HIGLIGHT_OPACITY, REGULAR_OPACITY, STROKE_SIZE, usePdfTools } from "../tools";
import { DRAWING_TYPES, RectangleCanvasElement, TextCanvasElement } from "../types";

import { useCanvasResizeObserver } from "./useCanvasResizeObserver";
import { PdfCanvasContext } from "./PdfCanvasContext";

export const PdfCanvasProvider = ({ children }: PropsWithChildren) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawerRef = useRef<HTMLCanvasElement>(null);
    const canvasContextRef = useRef<CanvasRenderingContext2D>(null);
    const drawerContextRef = useRef<CanvasRenderingContext2D>(null);

    const { selectedFile } = useFoldersManager();
    const { isPdfRendered, pageRef } = usePdfFile();
    const { color, currentRange, tool } = usePdfTools();

    useCanvasResizeObserver(
        pageRef,
        drawerRef,
        drawerContextRef
    );
    useCanvasResizeObserver(
        pageRef,
        canvasRef,
        canvasContextRef
    );

    const clear = () => console.log("Clearing");
    const drawLine = useCallback((rects: Array<DOMRect>) => {
        const ctx = drawerContextRef.current;
        const containerDimensions = pageRef.current?.getBoundingClientRect();

        if (!ctx || !containerDimensions) return;

        ctx.save();
        ctx.clearRect(0, 0, drawerRef.current!.width, drawerRef.current!.height);

        ctx.fillStyle = rgbToRgba(color, REGULAR_OPACITY);

        for (const rect of rects) {
            const height = STROKE_SIZE;
            const x = (rect.left - containerDimensions.left);
            const y = ((rect.top + rect.height - height) - containerDimensions.top);
            const width = rect.width;

            ctx.fillRect(x, y, width, height);
        }

        ctx.restore();
    }, [color]);
    const drawRect = useCallback((rects: Array<DOMRect>) => {
        const ctx = drawerContextRef.current;
        const containerDimensions = pageRef.current?.getBoundingClientRect();

        if (!ctx || !containerDimensions) return;

        ctx.save();
        ctx.clearRect(0, 0, drawerRef.current!.width, drawerRef.current!.height);

        ctx.fillStyle = rgbToRgba(color, HIGLIGHT_OPACITY);

        for (const rect of rects) {
            const { height, width } = rect;
            const x = (rect.left - containerDimensions.left);
            const y = (rect.top - containerDimensions.top);

            ctx.fillRect(x, y, width, height);
        }

        ctx.restore();
    }, [color]);

    const drawRectOnMount = (rectangleElement: RectangleCanvasElement) => {
        const ctx = canvasContextRef.current;
        const containerDimensions = pageRef.current?.getBoundingClientRect();

        if (!ctx || !containerDimensions) return;

        ctx.fillStyle = rectangleElement.color;
        ctx.fillRect(rectangleElement.x, rectangleElement.y, rectangleElement.width, rectangleElement.height);
    };
    const drawTextOnMount = (textElement: TextCanvasElement) => {
        const ctx = canvasContextRef.current;
        const containerDimensions = pageRef.current?.getBoundingClientRect();

        if (!ctx || !containerDimensions) return;

        ctx.fillStyle = textElement.options.color;
        ctx.fillText(textElement.text, textElement.options.x, textElement.options.y);
    };

    useEffect(() => {
        if (
            !canvasRef.current ||
            !drawerRef.current ||
            !isPdfRendered
        ) {
            return;
        }

        const targetPage = pageRef.current;
        if (!targetPage) {
            return
        };

        const drawerCtx = drawerRef.current.getContext("2d");
        if (!drawerCtx) {
            return
        };

        drawerContextRef.current = drawerCtx;

        const canvasCtx = canvasRef.current.getContext("2d");
        if (!canvasCtx) {
            return
        };

        canvasContextRef.current = canvasCtx;
    }, [isPdfRendered]);

    // Responsible to draw on user action
    useEffect(() => {
        if (!currentRange || !tool) return;

        if (tool === PDF_TOOLS.BRUSH) {
            // drawPath(points)
            return;
        }

        const rects = currentRange.getClientRects();
        const rectsArray = Array.from(rects);

        switch (tool) {
            case PDF_TOOLS.HIGHLIGHT:
            case PDF_TOOLS.VOCABULARY:
                drawRect(rectsArray);
                break;
            case PDF_TOOLS.NOTE:
            case PDF_TOOLS.UNDERLINE:
                drawLine(rectsArray);
                break;
            default:
                break;
        }
    }, [currentRange, tool]);
    // Responsible to draw the canvas elements from the folders structure
    useEffect(() => {
        if (!selectedFile.fileInStructure) {
            return;
        }

        const canvasCtx = canvasContextRef.current;
        const drawerCtx = drawerContextRef.current;

        if (canvasCtx && drawerCtx) {
            canvasCtx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            drawerCtx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        }

        for (const canvasElement of selectedFile.fileInStructure.canvasElements) {
            switch (canvasElement.type) {
                case DRAWING_TYPES.RECTANGLE:
                    drawRectOnMount(canvasElement.element);
                    break;
                case DRAWING_TYPES.TEXT:
                    drawTextOnMount(canvasElement.element);
                    break;
            }
        }
    }, [selectedFile.fileInStructure?.canvasElements]);

    return (
        <PdfCanvasContext value={{ canvasRef, drawerRef, clear }}>
            {children}
        </PdfCanvasContext>
    );
};
