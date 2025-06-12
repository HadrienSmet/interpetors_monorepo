import { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";

import { rgbToRgba } from "@/utils";

import { PDF_TOOLS } from "../../../types";

import { usePdfFile } from "../file";
import { HIGLIGHT_OPACITY, STROKE_SIZE, usePdfTools } from "../tools";

import { useCanvasResizeObserver } from "./useCanvasResizeObserver";
import { PdfCanvasContext } from "./PdfCanvasContext";

export const PdfCanvasProvider = ({ children }: PropsWithChildren) => {
    const [containerDimensions, setContainerDimensions] = useState<DOMRect | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContextRef = useRef<CanvasRenderingContext2D>(null);

    const { containerRef, isPdfRendered, pageRefs } = usePdfFile();
    const { color, currentRange, tool } = usePdfTools();

    const clear = () => console.log("Clearing");
    const drawLine = useCallback((rects: Array<DOMRect>) => {
        const ctx = canvasContextRef.current;
        if (!ctx || !containerDimensions) return;

        ctx.save();
        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

        ctx.fillStyle = rgbToRgba(color, HIGLIGHT_OPACITY);

        const dpr = window.devicePixelRatio || 1;

        for (const rect of rects) {
            const x = (rect.left - containerDimensions.left) * dpr;
            const y = (rect.top - containerDimensions.top) * dpr;
            const width = rect.width * dpr;
            const height = STROKE_SIZE * dpr;

            ctx.fillRect(x, y, width, height);
        }

        ctx.restore();
    }, [color, containerDimensions]);
    const drawRect = useCallback((rects: Array<DOMRect>) => {
        const ctx = canvasContextRef.current;
        if (!ctx || !containerDimensions) return;

        ctx.save();
        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

        ctx.fillStyle = rgbToRgba(color, HIGLIGHT_OPACITY);

        const dpr = window.devicePixelRatio || 1;

        for (const rect of rects) {
            const x = (rect.left - containerDimensions.left) * dpr;
            const y = (rect.top - containerDimensions.top) * dpr;
            const width = rect.width * dpr;
            const height = rect.height * dpr;

            ctx.fillRect(x, y, width, height);
        }

        ctx.restore();
    }, [color, containerDimensions]);

    // Responsible to create the canvas and to store the container dimensions.
    // TODO: PROBABLY need to handle multiple pages
    useEffect(() => {
        if (!isPdfRendered || !canvasRef.current || containerRef.current) {
            return;
        }

        // TODO: Add the target page in the state of PdfFile
        const targetPage = pageRefs.current[0];
        if (!targetPage) return;

        useCanvasResizeObserver(
            { current: targetPage },
            canvasRef,
            canvasContextRef
        );

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        canvasContextRef.current = ctx;
        setContainerDimensions(targetPage.getBoundingClientRect());
    }, [isPdfRendered]);
    // Responsible to draw
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

    return (
        <PdfCanvasContext value={{ canvasRef, clear }}>
            {children}
        </PdfCanvasContext>
    );
};
