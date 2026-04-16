import { PropsWithChildren, useEffect, useRef } from "react";

import { useResizableLayout } from "../contexts";

import "./resizableSection.scss";

type ResizableSectionProps =
    & {
        readonly id: string;
        readonly initialWidth: number;
        readonly minWidth?: number;
    }
    & PropsWithChildren;

const NAVIGATION_WIDTH = 50 as const;
const RESIZER_WIDTH = 3 as const;

export const ResizableSection = ({
    id,
    initialWidth,
    minWidth = 50,
    children,
}: ResizableSectionProps) => {
    const { registerSection, updateWidth, sections } = useResizableLayout();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        registerSection(id, initialWidth, minWidth);
    }, [id, initialWidth, minWidth, registerSection]);

    const startResize = (e: React.MouseEvent) => {
        e.preventDefault();

        const onMouseMove = (moveEvent: MouseEvent) => {
            updateWidth(id, moveEvent.clientX - NAVIGATION_WIDTH);
        };

        const onMouseUp = () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);

            window.dispatchEvent(new Event("layout-resized"));
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };

    const width = sections[id]?.width ?? initialWidth;

    return (
        <div
            className="resizable-section"
            ref={containerRef}
            style={{
                width,
                minWidth: width,
            }}
        >
            {children}
            <div
                className="resizable-section__resizer"
                onMouseDown={startResize}
                style={{
                    right: 0,
                    width: RESIZER_WIDTH,
                }}
            />
        </div>
    );
};
