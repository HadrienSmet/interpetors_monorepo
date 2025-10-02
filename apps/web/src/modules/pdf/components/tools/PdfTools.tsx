import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    MdArrowBack,
    MdArrowForward,
    MdBorderColor,
    MdBrush,
    MdComment,
    MdDownload,
    MdFormatColorFill,
    MdTranslate,
} from "react-icons/md";

import { ColorKind, RgbColor } from "@repo/types";

import { DraggableSection, useDraggableSection } from "@/components";
import { ColorPicker, ColorSwatch, useColorPanel } from "@/modules/colorPanel";
import { PDF_TOOLS } from "@/modules/files";
import { getRgbColor, handleActionColor } from "@/utils";

import { usePdfFile, usePdfTools } from "../../contexts";

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

const PdfToolsChild = () => {
    const [isPickingColor, setIsPickingColor] = useState(false);

    const { colorPanel } = useColorPanel();
    const { dynamicClass, isLandscape, isLeftSide, isOpen, isTopSide } = useDraggableSection();
    const { downloadPdfFile } = usePdfFile();
    const { color, setColor } = usePdfTools();
    const { t } = useTranslation();

    const rgbColor = useMemo(() => handleActionColor(color, colorPanel), [color, colorPanel]);
    const colorPickerBg = useMemo(() => getRgbColor(rgbColor), [color, colorPanel]);

    const togglePickingColor = () => setIsPickingColor(state => !state);
    const handlePickerColor = (value: RgbColor) => setColor({ kind: ColorKind.INLINE, value });
    const handlePropositionColor = (colorSwatch: ColorSwatch) => setColor({
        kind: ColorKind.PANEL,
        lastValue: colorSwatch.value,
        value: colorSwatch.id,
    });

    // Cleaning the state on closing panel tools
    useEffect(() => {
        if (!isOpen) {
            setIsPickingColor(false);
        }
    }, [isOpen]);

    return (
        <div className={`pdf-tools ${dynamicClass} ${isLeftSide ? "left" : "right"} ${isTopSide ? "top" : "bot"}`}>
            <div className="pdf-tools-buttons">
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
                <button
                    onClick={downloadPdfFile}
                    title={t("actions.download")}
                >
                    <MdDownload />
                </button>
                <button
                    onClick={togglePickingColor}
                    title={t("files.editor.tools.color")}
                >
                    <div
                        className="color-picker-trigger"
                        style={{ backgroundColor: colorPickerBg }}
                    />
                </button>
            </div>
            <div className={`color-picker-container ${isPickingColor ? "expanded" : ""}`}>
                <ColorPicker
                    color={rgbColor}
                    displayPropositions
                    handlePickerColor={handlePickerColor}
                    handlePropositionColor={handlePropositionColor}
                    height={COLOR_PICKER_DIMENSION}
                    isLandscape={!isLandscape}
                    onSelection={() => setIsPickingColor(false)}
                    width={COLOR_PICKER_DIMENSION}
                />
            </div>
        </div>

    );
};

export const PdfTools = () => (
    <DraggableSection
        expansionEnabled
        rotateEnabled
    >
        <PdfToolsChild />
    </DraggableSection>
);
