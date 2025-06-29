import { PropsWithChildren, useCallback, useEffect, useRef } from "react";

import { Position } from "@/types";
import { getRgbColor, rgbToRgba } from "@/utils";

import { DRAWING_TYPES, PathCanvasElement, PathElementAction, PDF_TOOLS, RectangleCanvasElement, TextCanvasElement } from "../../../types";
import { HIGLIGHT_OPACITY, REGULAR_OPACITY, STROKE_SIZE } from "../../../utils";

import { useFoldersManager } from "../../manager";

import { usePdfFile } from "../file";
import { HistoryAction, usePdfHistory } from "../history";
import { usePdfTools } from "../tools";

import { PdfCanvasContext } from "./PdfCanvasContext";
import { useCanvasResizeObserver } from "./useCanvasResizeObserver";

export const PdfCanvasProvider = ({ children }: PropsWithChildren) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawerRef = useRef<HTMLCanvasElement>(null);
    const canvasContextRef = useRef<CanvasRenderingContext2D>(null);
    const drawerContextRef = useRef<CanvasRenderingContext2D>(null);

    const { selectedFile } = useFoldersManager();
    const { displayLoader, isPdfRendered, pageIndex, pageRef, pdfDoc } = usePdfFile();
    const { pushAction } = usePdfHistory();
    const { color, currentRange, tool } = usePdfTools();

    useCanvasResizeObserver(
        pageRef,
        canvasRef,
        canvasContextRef
    );
    useCanvasResizeObserver(
        pageRef,
        drawerRef,
        drawerContextRef
    );

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx = canvasContextRef.current;
        if (!ctx || !canvas) return;

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
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

    const drawPathOnMount = (pathElement: PathCanvasElement) => {
        const ctx = canvasContextRef.current;

        if (!ctx) return;

        ctx.lineWidth = STROKE_SIZE;
        ctx.strokeStyle = pathElement.color;

        ctx.beginPath();

        const { x: startX, y: startY } = pathElement.points[0];

        ctx.moveTo(startX, startY);

        for (let i = 1; i < pathElement.points.length; i++) {
            const { x, y } = pathElement.points[i];

            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }
    const drawRectOnMount = (rectangleElement: RectangleCanvasElement) => {
        const ctx = canvasContextRef.current;

        if (!ctx) return;

        ctx.fillStyle = rectangleElement.color;
        ctx.fillRect(rectangleElement.x, rectangleElement.y, rectangleElement.width, rectangleElement.height);
    };
    const drawTextOnMount = (textElement: TextCanvasElement) => {
        const ctx = canvasContextRef.current;
        const containerDimensions = pageRef.current?.getBoundingClientRect();

        if (!ctx || !containerDimensions) return;

        ctx.fillStyle = textElement.options.color;
        ctx.font = "8px serif";
        ctx.fillText(textElement.text, textElement.options.x, textElement.options.y);
    };
    // Stores the canvas refs once the pdf is rendered
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
            return;
        };

        const drawerCtx = drawerRef.current.getContext("2d");
        if (!drawerCtx) {
            return;
        };
        drawerContextRef.current = drawerCtx;

        const canvasCtx = canvasRef.current.getContext("2d");
        if (!canvasCtx) {
            return;
        };
        canvasContextRef.current = canvasCtx;
    }, [isPdfRendered]);
    // Responsible to draw on user action
    useEffect(() => {
        if (!currentRange || !tool) return;

        if (tool === PDF_TOOLS.BRUSH) {
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
    // Handles the brush
    useEffect(() => {
        const pdfFile = selectedFile.fileInStructure;
        if (!isPdfRendered || !pageRef.current || !pdfFile) return;

        const canvas = drawerRef.current;
        if (!canvas || tool !== PDF_TOOLS.BRUSH) return;


        const pageDimensions = pageRef.current.getBoundingClientRect();

        canvas.width = pageDimensions.width;
        canvas.height = pageDimensions.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let points: Array<Position> = [];
        let isDrawing = false;

        ctx.lineWidth = STROKE_SIZE;
        ctx.strokeStyle = getRgbColor(color);

        const handleMouseDown = (e: MouseEvent) => {
            isDrawing = true;

            ctx.beginPath();
            ctx.moveTo(e.clientX - pageDimensions.left, e.clientY - pageDimensions.top);

            points.push({ x: e.clientX, y: e.clientY });
        };
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDrawing) return;

            ctx.lineTo(e.clientX - pageDimensions.left, e.clientY - pageDimensions.top);
            ctx.stroke();

            points.push({ x: e.clientX, y: e.clientY });
        };
        const handleMouseUp = async () => {
            if (points.length < 2 || !pdfDoc) return;

            const element: PathElementAction = {
                color,
                pageDimensions,
                pageIndex,
                pdfDoc,
                pdfFile,
                points,
            };
            const historyAction: HistoryAction = {
                elements: [{ type: DRAWING_TYPES.PATH, element }],
            };

            pushAction(historyAction);

            points = [];
            isDrawing = false;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            window.getSelection()?.removeAllRanges();
        };

        pageRef.current.addEventListener("mousedown", handleMouseDown);
        pageRef.current.addEventListener("mousemove", handleMouseMove);
        pageRef.current.addEventListener("mouseup", handleMouseUp);

        return () => {
            pageRef.current?.removeEventListener("mousedown", handleMouseDown);
            pageRef.current?.removeEventListener("mousemove", handleMouseMove);
            pageRef.current?.removeEventListener("mouseup", handleMouseUp);
        };
    }, [color, isPdfRendered, pdfDoc, selectedFile.fileInStructure, tool]);
    // Responsible to draw the canvas elements from file update / page change
    useEffect(() => {
        if (!selectedFile.fileInStructure || !isPdfRendered || displayLoader) {
            return;
        }

        const canvasCtx = canvasContextRef.current;
        const drawerCtx = drawerContextRef.current;

        if (canvasCtx && drawerCtx) {
            canvasCtx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            drawerCtx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        }

        if (
            !selectedFile.fileInStructure.elements[pageIndex] ||
            selectedFile.fileInStructure.elements[pageIndex].canvasElements.length < 1
        ) {
            return;
        }

        for (const canvasElement of selectedFile.fileInStructure.elements[pageIndex].canvasElements) {
            switch (canvasElement.type) {
                case DRAWING_TYPES.PATH:
                    drawPathOnMount(canvasElement.element);
                    break;
                case DRAWING_TYPES.RECTANGLE:
                    drawRectOnMount(canvasElement.element);
                    break;
                case DRAWING_TYPES.TEXT:
                    drawTextOnMount(canvasElement.element);
                    break;
            }
        }
    }, [
        displayLoader,
        isPdfRendered,
        selectedFile.fileInStructure?.elements[pageIndex].canvasElements,
        pageIndex
    ]);

    return (
        <PdfCanvasContext value={{ canvasRef, drawerRef, clear }}>
            {children}
        </PdfCanvasContext>
    );
};
