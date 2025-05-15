import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    MdDragIndicator,
    MdExpandLess,
    MdExpandMore,
    MdOutlineMoreHoriz,
    MdOutlineMoreVert,
} from "react-icons/md";

import { ColorPicker, RgbColor } from "@/components";

import { PdfTool, ToolButton, TOOLS_BUTTONS } from "./PdfToolButton";
import "./pdfTools.scss";
import { getRgbColor } from "../pdfEditor.utils";

export type PdfEditorToolsState = {
    readonly color: RgbColor;
    readonly tool: PdfTool | null;
};
type PdfToolsProps =
    & PdfEditorToolsState
    & {
        readonly onToolSelection: (tool: PdfTool | null) => void;
        readonly setColor: (color: RgbColor) => void;
    };

const PANEL_PADDING = 8 as const;
const PANEL_SIZE = 305 as const;
const COLOR_PICKER_DIMENSION = PANEL_SIZE - (PANEL_PADDING * 2);
export const PdfTools = (props: PdfToolsProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isLandscape, setIsLandscape] = useState(false);
    const [isLeftSide, setIsLeftSide] = useState(true);
    const [isOpen, setIsOpen] = useState(true);
    const [isPickingColor, setIsPickingColor] = useState(false);
    const [isTopSide, setIsTopSide] = useState(true);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const containerRef = useRef<HTMLDivElement | null>(null);
    const dragStartPos = useRef<{ x: number, y: number }>({ x: 0, y: 0 });

    const { t } = useTranslation();

    const colorPickerBg = useMemo(() => getRgbColor(props.color), [props.color]);
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

        setIsTopSide(e.clientY < (window.innerHeight/2));
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
                            className={`tools-container ${dynamicClass} ${isLeftSide ? "left" : "right"} ${isTopSide ? "top" : "bot"}`}
                        >
                            {TOOLS_BUTTONS.map(item => (
                                <ToolButton
                                    key={item.id}
                                    {...item}
                                    {...props}
                                />
                            ))}
                            <button>
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
                        {...props}
                        height={COLOR_PICKER_DIMENSION}
                        width={COLOR_PICKER_DIMENSION}
                    />
                </div>
            )}
        </div>
    );
};
