import { useEffect, useRef, useCallback, RefObject } from "react";

export function useCanvasResizeObserver(
    pageRef: RefObject<HTMLDivElement | null> | null,
    canvasRef: RefObject<HTMLCanvasElement | null>,
    canvasContextRef: RefObject<CanvasRenderingContext2D | null>
) {
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
        if (!page) {
            return
        };

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
    }, [resizeCanvas, pageRef]);
}
