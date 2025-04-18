import { PropsWithChildren, useEffect, useRef, useState } from "react";

import "./resizableSection.scss";

type ResizableSectionProps =
    & {
        readonly initialWidth: number;
        readonly resizableSide?: "left" | "right";
    }
    & PropsWithChildren;

const RESIZER_WIDTH = 3 as const;
export const ResizableSection = ({
    children,
    initialWidth,
    resizableSide = "right",
}: ResizableSectionProps) => {
    const [width, setWidth] = useState(initialWidth);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;

            const container = containerRef.current;
            const containerLeft = container.getBoundingClientRect().left;
            const containerRight = container.getBoundingClientRect().right;

            if (resizableSide === "right") {
                const newWidth = e.clientX - containerLeft;
                setWidth(Math.max(100, newWidth)); // minimum width 100px
            } else {
                const newWidth = containerRight - e.clientX;
                setWidth(Math.max(100, newWidth));
            }
        };

        const stopResize = () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", stopResize);
        };

        const startResize = () => {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", stopResize);
        };

        const resizer = containerRef.current?.querySelector(".resizable-section__resizer");
        resizer?.addEventListener("mousedown", startResize);

        return () => {
            resizer?.removeEventListener("mousedown", startResize);
            stopResize(); // cleanup
        };
    }, [resizableSide]);

    return (
        <div
            className="resizable-section"
            ref={containerRef}
            style={{ width }}
        >
            {children}
            <div
                className="resizable-section__resizer"
                style={{
                    [resizableSide]: 0,
                    width: RESIZER_WIDTH,
                }}
            />
        </div>
    );
};
