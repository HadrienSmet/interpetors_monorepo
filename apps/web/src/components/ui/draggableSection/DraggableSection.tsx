import { PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";
import { MdDragIndicator, MdExpandLess, MdExpandMore, MdOutlineMoreHoriz, MdOutlineMoreVert } from "react-icons/md";
import { useTranslation } from "react-i18next";

import { useCssVariable } from "@/hooks";
import { Position } from "@/types";

import { DraggableSectionProvider } from "./DraggableSectionProvider";
import { useDraggableSection } from "./DraggableSectionContext";
import "./draggableSection.scss";

const DraggableSectionChild = ({ children, expansionEnabled, rotateEnabled }: DraggableSectionProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const defaultBg = useCssVariable("--clr-txt-02");
    const {
        dynamicClass,
        isLandscape,
        isOpen,
        setIsLandscape,
        setIsLeftSide,
        setIsOpen,
        setIsTopSide,
    } = useDraggableSection();
    const { t } = useTranslation();

    const containerRef = useRef<HTMLDivElement | null>(null);
    const dragStartPos = useRef<Position>({ x: 0, y: 0 });

    const toggleDirection = () => setIsLandscape(state => !state);
    const toggleOpen = () => setIsOpen(state => !state);

    const onMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsDragging(true);

        dragStartPos.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
    };
    const onMouseMove = (e: MouseEvent | React.MouseEvent<HTMLButtonElement>) => {
        if (!isDragging || !containerRef.current) return;

        const parentRect = containerRef.current.parentElement?.getBoundingClientRect();
        const toolsRect = containerRef.current.getBoundingClientRect();

        if (!parentRect) return;

        const newX = e.clientX - dragStartPos.current.x;
        const newY = e.clientY - dragStartPos.current.y;

        const clampedX = Math.min(
            Math.max(newX, 0),
            parentRect.width - toolsRect.width
        );
        const clampedY = Math.min(
            Math.max(newY, 0),
            parentRect.height - toolsRect.height
        );

        setPosition({ x: clampedX, y: clampedY });

        const centerX = parentRect.width / 2;
        setIsLeftSide(clampedX < centerX);

        setIsTopSide(e.clientY < (window.innerHeight / 2));
    };
    const onMouseUp = () => setIsDragging(false);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
        } else {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [isDragging]);

    const dragButtonStyle = useMemo(() => (
        (!rotateEnabled)
            ? {
                backgroundColor: defaultBg,
                height: "100%",
                width: "100%",
            }
            : {}
    ), [expansionEnabled, rotateEnabled])

    return (
        <div
            className={`draggable-section ${dynamicClass} ${isOpen ? "" : "closed"}`}
            ref={containerRef}
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
            }}
        >
            <div className={`draggable-section-settings ${dynamicClass}`}>
                <button
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    style={{
                        cursor: isDragging ? "grabbing" : "grab",
                        ...dragButtonStyle,
                    }}
                    title={t("files.editor.tools.drag")}
                >
                    <MdDragIndicator />
                </button>
                {rotateEnabled && (
                    isLandscape
                        ? (
                            <button title={t("files.editor.tools.vertical")}>
                                <MdOutlineMoreVert onClick={toggleDirection} />
                            </button>
                        )
                        : (
                            <button title={t("files.editor.tools.horizontal")}>
                                <MdOutlineMoreHoriz onClick={toggleDirection} />
                            </button>
                        )
                )}
                {expansionEnabled && (
                    isOpen
                        ? (
                            <button
                                className={isLandscape ? "expansion-row" : ""}
                                title={t("files.editor.tools.close")}
                            >
                                <MdExpandLess onClick={toggleOpen} />
                            </button>
                        )
                        : (
                            <button
                                className={isLandscape ? "expansion-row" : ""}
                                title={t("files.editor.tools.open")}
                            >
                                <MdExpandMore onClick={toggleOpen} />
                            </button>
                        )
                )}
            </div>

            <div className={`divider ${dynamicClass}`} />

            <div className="draggable-section-content">
                {children}
            </div>
        </div>
    );
};

type DraggableSectionProps =
    & {
        readonly defaultRotation?: "column" | "row";
        readonly expansionEnabled?: boolean;
        readonly rotateEnabled?: boolean;
    }
    & PropsWithChildren;
export const DraggableSection = ({ children, defaultRotation = "column", expansionEnabled = false, rotateEnabled = false }: DraggableSectionProps) => (
    <DraggableSectionProvider defaultRotation={defaultRotation}>
        <DraggableSectionChild
            expansionEnabled={expansionEnabled}
            rotateEnabled={rotateEnabled}
        >
            {children}
        </DraggableSectionChild>
    </DraggableSectionProvider>
);
