import { useEffect, useRef, useCallback, RefObject } from "react";

type UseCanvasResizeObserverParams = {
    readonly canvasContextRef: RefObject<CanvasRenderingContext2D | null>;
    readonly canvasRef: RefObject<HTMLCanvasElement | null>;
    readonly isPdfRendered: boolean;
    readonly pageRef: RefObject<HTMLDivElement | null> | null;
};
export const useCanvasResizeObserver = ({
    canvasContextRef,
    canvasRef,
    isPdfRendered,
    pageRef,
}: UseCanvasResizeObserverParams) => {
    const observer = useRef<ResizeObserver | null>(null);

    const resizeCanvas = useCallback(() => {
        const page = pageRef?.current;
        const canvas = canvasRef.current;

        if (!page || !canvas) {
            return
        };

        const rect = page.getBoundingClientRect();

        canvas.width = rect.width;
        canvas.height = rect.height;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        const ctx = canvas.getContext("2d");
        if (ctx) {
            canvasContextRef.current = ctx;
        }
    }, [pageRef, canvasRef, canvasContextRef]);

    useEffect(() => {
        const page = pageRef?.current;
        if (!isPdfRendered || !page) return;

        observer.current = new ResizeObserver(() => {
            resizeCanvas();
        });

        observer.current.observe(page);

        // Initial resize
        resizeCanvas();

        return () => {
            if (observer.current && page) {
                observer.current.unobserve(page);
            }
        };
    }, [resizeCanvas, pageRef, isPdfRendered]);
}
