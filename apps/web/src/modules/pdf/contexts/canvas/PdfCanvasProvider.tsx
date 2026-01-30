import { PropsWithChildren, useCallback, useEffect, useRef } from "react";

import {
    DRAWING_TYPES,
    FILE_TOOLS,

    HistoryAction,
    PathActionElement,
    Position,
} from "@repo/types";

import { useColorPanel } from "@/modules/colorPanel";
import { HIGLIGHT_OPACITY, REGULAR_OPACITY, STROKE_SIZE } from "@/modules/files";
import { useFoldersActions, useFoldersManager } from "@/modules/folders";
import { handleActionColor, rgbToRgba, stringToRgba } from "@/utils";

import {
    convertPathAction,
    convertRectAction,
    convertTextAction,
    PathCanvasElement,
    RectCanvasElement,
    TextCanvasElement,
} from "../../utils";

import { usePdfFile } from "../file";
import { usePdfHistory } from "../history";
import { usePdfTools } from "../tools";

import { PdfCanvasContext } from "./PdfCanvasContext";
import { useCanvasResizeObserver } from "./useCanvasResizeObserver";

export const PdfCanvasProvider = ({ children }: PropsWithChildren) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawerRef = useRef<HTMLCanvasElement>(null);
    const canvasContextRef = useRef<CanvasRenderingContext2D>(null);
    const drawerContextRef = useRef<CanvasRenderingContext2D>(null);

    const { colorPanel } = useColorPanel();
    const { getPageActions } = useFoldersActions();
    const { selectedFile } = useFoldersManager();
    const { containerRef, displayLoader, isPdfRendered, pageIndex, pageRef } = usePdfFile();
    const { pushAction, version } = usePdfHistory();
    const { color, currentRange, tool } = usePdfTools();

    const rgbColor = handleActionColor(color, colorPanel);
    const getColorToUse = (opacity: number) => rgbToRgba(rgbColor, opacity);

    useCanvasResizeObserver({
        canvasContextRef,
        canvasRef,
        isPdfRendered,
        pageRef,
    });
    useCanvasResizeObserver({
        canvasContextRef: drawerContextRef,
        canvasRef: drawerRef,
        isPdfRendered,
        pageRef,
    });

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

        const colorToUse = getColorToUse(REGULAR_OPACITY);
        if (!ctx || !containerDimensions || !colorToUse) return;

        ctx.save();
        ctx.clearRect(0, 0, drawerRef.current!.width, drawerRef.current!.height);

        ctx.fillStyle = colorToUse;

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
        const colorToUse = getColorToUse(HIGLIGHT_OPACITY);
        if (!ctx || !containerDimensions || !colorToUse) return;

        ctx.save();
        ctx.clearRect(0, 0, drawerRef.current!.width, drawerRef.current!.height);

        ctx.fillStyle = colorToUse;

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

        const { x: startX, y: startY } = pathElement.points[0];

        ctx.beginPath();
        ctx.moveTo(startX, startY);

        for (let i = 1; i < pathElement.points.length; i++) {
            const { x, y } = pathElement.points[i];

            ctx.lineTo(x, y);
            ctx.stroke();
        }
    };
    const drawRectOnMount = (rectangleElement: RectCanvasElement) => {
        const ctx = canvasContextRef.current;

        if (!ctx) return;

        ctx.fillStyle = stringToRgba(rectangleElement.color, rectangleElement.opacity);
        ctx.fillRect(rectangleElement.x, rectangleElement.y, rectangleElement.width, rectangleElement.height);
    };
    const drawTextOnMount = (textElement: TextCanvasElement) => {
        const containerDimensions = pageRef.current?.getBoundingClientRect();
        const ctx = canvasContextRef.current;

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

        const canvasCtx = canvasRef.current.getContext("2d");
        const drawerCtx = drawerRef.current.getContext("2d");
        const targetPage = pageRef.current;

        if (!targetPage || !drawerCtx || !canvasCtx) return;

        drawerContextRef.current = drawerCtx;
        canvasContextRef.current = canvasCtx;
    }, [isPdfRendered]);
    // Responsible to draw on user action
    useEffect(() => {
        if (!currentRange || !tool || tool === FILE_TOOLS.BRUSH) return;

        const rects = currentRange.getClientRects();
        const rectsArray = Array.from(rects);

        switch (tool) {
            case FILE_TOOLS.HIGHLIGHT:
            case FILE_TOOLS.VOCABULARY:
                drawRect(rectsArray);
                break;
            case FILE_TOOLS.NOTE:
            case FILE_TOOLS.UNDERLINE:
                drawLine(rectsArray);
                break;
            default:
                break;
        }
    }, [currentRange, tool]);
    // Handles the brush
    useEffect(() => {
        const { fileInStructure: pdfFile } = selectedFile;
        const canvas = drawerRef.current;
        if (
            !isPdfRendered ||
            !pageRef.current ||
            !pdfFile ||
            !canvas ||
            tool !== FILE_TOOLS.BRUSH
        ) {
            return;
        }

        const pageDimensions = pageRef.current.getBoundingClientRect();

        canvas.width = pageDimensions.width;
        canvas.height = pageDimensions.height;

        const colorToUse = getColorToUse(REGULAR_OPACITY);
        const ctx = canvas.getContext("2d");
        if (!ctx || !colorToUse) return;

        let points: Array<Position> = [];
        let isDrawing = false;

        ctx.lineWidth = STROKE_SIZE;
        ctx.strokeStyle = colorToUse;

        const getPoints = (e: MouseEvent) => ({
            x: e.clientX,
            y: e.clientY + (containerRef.current?.scrollTop ?? 0),
        });
        const getPositions = (e: MouseEvent) => {
            const { x, y } = getPoints(e);

            return ({
                x: x - pageDimensions.left,
                y: y - pageDimensions.top,
            });
        };
        const handleMouseDown = (e: MouseEvent) => {
            isDrawing = true;

            const { x: canvasX, y: canvasY } = getPositions(e);
            ctx.beginPath();
            ctx.moveTo(canvasX, canvasY);

            const { x, y } = getPoints(e);
            points.push({ x, y });
        };
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDrawing) return;

            const { x: canvasX, y: canvasY } = getPositions(e);
            ctx.lineTo(canvasX, canvasY);
            ctx.stroke();

            const { x, y } = getPoints(e);
            points.push({ x, y });
        };
        const handleMouseUp = () => {
            if (points.length < 2) return;

            const element: PathActionElement = {
                color,
                pageDimensions,
                pageIndex,
                file: pdfFile.file,
                points,
            };
            const historyAction: HistoryAction = {
                elements: [{ type: DRAWING_TYPES.PATH, element }],
            };

            pushAction(historyAction);

            points = [];
            isDrawing = false;

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
    }, [color, isPdfRendered, pushAction, selectedFile.fileInStructure, tool]);
    // Responsible to draw the canvas elements from file update / page change
    useEffect(() => {
        if (!selectedFile.fileInStructure || !isPdfRendered || displayLoader) return;

        const pageActions = getPageActions(selectedFile.fileInStructure.id, pageIndex);

        const canvasCtx = canvasContextRef.current;
        const drawerCtx = drawerContextRef.current;

        if (canvasCtx && canvasRef.current) {
            canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }

        if (
            !pageActions ||
            pageActions.elements.length < 1
        ) {
            return;
        }

        for (const element of pageActions.elements) {
            switch (element.type) {
                case DRAWING_TYPES.PATH:
                    drawPathOnMount(convertPathAction(element, colorPanel));
                    break;
                case DRAWING_TYPES.RECT: { 
					const rectElements = convertRectAction(element, colorPanel);

                    rectElements.forEach(rect => drawRectOnMount(rect));
                    break; 
				}
                case DRAWING_TYPES.TEXT:
                    drawTextOnMount(convertTextAction(element, colorPanel));
                    break;
            }
        }

        if (drawerCtx && canvasRef.current) {
            drawerCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    }, [
        colorPanel,
        displayLoader,
        isPdfRendered,
        pageIndex,
        selectedFile,
        version,
    ]);

    return (
        <PdfCanvasContext value={{ canvasRef, drawerRef, clear }}>
            {children}
        </PdfCanvasContext>
    );
};
