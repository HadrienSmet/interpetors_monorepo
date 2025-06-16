import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    MdArrowBack,
    MdArrowForward,
    MdBorderColor,
    MdBrush,
    MdComment,
    MdDragIndicator,
    MdExpandLess,
    MdExpandMore,
    MdFormatColorFill,
    MdOutlineMoreHoriz,
    MdOutlineMoreVert,
    MdTranslate,
} from "react-icons/md";

import { ColorPicker } from "@/components";
import { Position } from "@/types";
import { getRgbColor } from "@/utils";

import { usePdfTools } from "../../../../contexts";
import { PDF_TOOLS } from "../../../../types";

import { HistoryButton, HistoryButtonItem, ToolButton, ToolButtonItem } from "./buttons";
import "./pdfTools.scss";

const PANEL_PADDING = 8 as const;
const PANEL_SIZE = 313 as const;
const COLOR_PICKER_DIMENSION = PANEL_SIZE - (PANEL_PADDING * 2);

const HISTORY_BUTTONS: Array<HistoryButtonItem> = [
    {
        icon: <MdArrowBack />,
        id: "backward",
    },
    {
        icon: <MdArrowForward />,
        id: "forward",
    },
];
// TODO: Need to have one source of truth for tools icons
const TOOLS_BUTTONS: Array<ToolButtonItem> = [
    {
        icon: <MdBorderColor />,
        id: PDF_TOOLS.UNDERLINE,
    },
    {
        icon: <MdFormatColorFill />,
        id: PDF_TOOLS.HIGHLIGHT,
    },
    {
        icon: <MdBrush />,
        id: PDF_TOOLS.BRUSH,
    },
    {
        icon: <MdComment />,
        id: PDF_TOOLS.NOTE,
    },
    {
        icon: <MdTranslate />,
        id: PDF_TOOLS.VOCABULARY,
    },
];

export const PdfTools = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [isLandscape, setIsLandscape] = useState(false);
    const [isLeftSide, setIsLeftSide] = useState(true);
    const [isOpen, setIsOpen] = useState(true);
    const [isPickingColor, setIsPickingColor] = useState(false);
    const [isTopSide, setIsTopSide] = useState(true);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const containerRef = useRef<HTMLDivElement | null>(null);
    const dragStartPos = useRef<Position>({ x: 0, y: 0 });

    const { color, setColor } = usePdfTools();
    const { t } = useTranslation();

    const colorPickerBg = useMemo(() => getRgbColor(color), [color]);
    const dynamicClass = useMemo(() => (isLandscape ? "row" : "column"), [isLandscape]);

    const toggleDirection = () => setIsLandscape(state => !state);
    const toggleOpen = () => setIsOpen(state => !state);
    const togglePickingColor = () => setIsPickingColor(state => !state);

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
    // Cleaning the state on closing panel tools
    useEffect(() => {
        if (!isOpen) {
            setIsPickingColor(false);
        }
    }, [isOpen]);

    return (
        <div
            className={`pdf-tools ${dynamicClass}`}
            ref={containerRef}
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
            }}
        >
            <div className={`pdf-tools-buttons ${dynamicClass}`}>
                {/* Tools settings */}
                <div className={`settings ${dynamicClass}`}>
                    <button
                        onMouseDown={onMouseDown}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        style={{ cursor: isDragging ? "grabbing" : "grab", }}
                        title={t("files.editor.tools.drag")}
                    >
                        <MdDragIndicator />
                    </button>
                    {isLandscape
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
                    }
                    {isOpen
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
                    }
                </div>
                {/* File tools */}
                {isOpen && (
                    <>
                        <div className={`divider ${dynamicClass}`} />
                        <div
                            className={`tools-container ${dynamicClass} ${isLeftSide ? "left" : "right"} ${isTopSide ? "top" : "bot"}`}
                        >
                            {HISTORY_BUTTONS.map(item => (
                                <HistoryButton
                                    key={item.id}
                                    {...item}
                                />
                            ))}
                            {TOOLS_BUTTONS.map(item => (
                                <ToolButton
                                    key={item.id}
                                    {...item}
                                />
                            ))}
                            <button title={t("files.editor.tools.color")}>
                                <div
                                    className="color-picker-trigger"
                                    onClick={togglePickingColor}
                                    style={{ backgroundColor: colorPickerBg }}
                                />
                            </button>
                        </div>
                    </>
                )}
            </div>

            {isPickingColor && (
                <div className="color-picker-container">
                    <ColorPicker
                        color={color}
                        height={COLOR_PICKER_DIMENSION}
                        isLandscape={!isLandscape}
                        setColor={setColor}
                        width={COLOR_PICKER_DIMENSION}
                    />
                </div>
            )}
        </div>
    );
};
