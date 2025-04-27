import { PropsWithChildren, useEffect, useRef, useState } from "react";

import "./resizableSection.scss";

type ResizableSectionProps =
    & {
        readonly getMaxWidth?: () => number;
        readonly initialWidth: number;
        readonly minWidth?: number;
        readonly resizableSide?: "left" | "right";
    }
    & PropsWithChildren;

const RESIZER_WIDTH = 3 as const;
const COLUMN_MIN_WIDTH = 50 as const;
export const ResizableSection = ({
    children,
    initialWidth,
    resizableSide = "right",
    minWidth = COLUMN_MIN_WIDTH,
    getMaxWidth,
}: ResizableSectionProps) => {
    const [width, setWidth] = useState(initialWidth);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let isResizing = false;

        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing || !containerRef.current) return;

            e.preventDefault();

            const container = containerRef.current;
            const containerLeft = container.getBoundingClientRect().left;
            const containerRight = container.getBoundingClientRect().right;

            let newWidth: number;

            if (resizableSide === "right") {
                newWidth = e.clientX - containerLeft;
            } else {
                newWidth = containerRight - e.clientX;
            }

            newWidth = Math.max(minWidth, newWidth);

            if (getMaxWidth) {
                const maxWidth = getMaxWidth();
                newWidth = Math.min(newWidth, maxWidth);
            }

            setWidth(newWidth);
        };

        const stopResize = () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.userSelect = "";
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mouseup", stopResize);
            }
        };

        const startResize = () => {
            isResizing = true;

            document.body.style.userSelect = "none"; // 👈 Désactive la sélection de texte pendant le drag
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", stopResize);
        };

        const resizer = containerRef.current?.querySelector(".resizable-section__resizer");
        resizer?.addEventListener("mousedown", startResize);

        return () => {
            resizer?.removeEventListener("mousedown", startResize);
            stopResize();
        };
    }, [getMaxWidth, minWidth, resizableSide]);

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
