import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    MdBorderColor,
    MdBrush,
    MdComment,
    MdDragIndicator,
    MdExpandLess,
    MdExpandMore,
    MdFormatColorFill,
    MdOutlineMenuBook,
    MdOutlineMoreHoriz,
    MdOutlineMoreVert,
} from "react-icons/md";

import "./pdfTools.scss";

export const PdfTools = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [isLandscape, setIsLandscape] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const containerRef = useRef<HTMLDivElement | null>(null);
    const dragStartPos = useRef<{ x: number, y: number }>({ x: 0, y: 0 });

    const { t } = useTranslation();

    const dynamicClass = useMemo(() => (
        isLandscape ? "row" : "column"
    ), [isLandscape]);

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

    return (
        <div
            className={`pdf-tools ${dynamicClass}`}
            ref={containerRef}
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
            }}
        >
            {/* Tools settings */}
            <div className={`settings ${dynamicClass}`}>
                <button
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    style={{ cursor: isDragging ? "grabbing" : "grab", }}
                    title={t("views.new.fileEditor.settings.drag")}
                >
                    <MdDragIndicator />
                </button>
                {isLandscape
                    ? (
                        <button title={t("views.new.fileEditor.settings.vertical")}>
                            <MdOutlineMoreVert onClick={toggleDirection} />
                        </button>
                    )
                    : (
                        <button title={t("views.new.fileEditor.settings.horizontal")}>
                            <MdOutlineMoreHoriz onClick={toggleDirection} />
                        </button>
                    )
                }
                {isOpen
                    ? (
                        <button
                            className={isLandscape ? "expansion-row" : ""}
                            title={t("views.new.fileEditor.settings.close")}
                        >
                            <MdExpandLess onClick={toggleOpen} />
                        </button>
                    )
                    : (
                        <button
                            className={isLandscape ? "expansion-row" : ""}
                            title={t("views.new.fileEditor.settings.open")}
                        >
                            <MdExpandMore onClick={toggleOpen} />
                        </button>
                    )
                }
            </div>
            {/* File tools */}
            {isOpen && (
                <>
                    <div className={`divider ${dynamicClass}`} />
                    <div
                        className={`tools-container ${dynamicClass}`}
                    >
                        <button title={t("views.new.fileEditor.settings.underline")}>
                            <MdBorderColor />
                        </button>
                        <button title={t("views.new.fileEditor.settings.highlight")}>
                            <MdFormatColorFill />
                        </button>
                        <button title={t("views.new.fileEditor.settings.brush")}>
                            <MdBrush />
                        </button>
                        <button title={t("views.new.fileEditor.settings.note")}>
                            <MdComment />
                        </button>
                        <button title={t("views.new.fileEditor.settings.vocabulary")}>
                            <MdOutlineMenuBook />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
