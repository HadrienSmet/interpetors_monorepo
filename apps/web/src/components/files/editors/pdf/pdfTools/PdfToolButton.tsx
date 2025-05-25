import React from "react";
import { useTranslation } from "react-i18next";
import {
    MdBorderColor,
    MdBrush,
    MdComment,
    MdFormatColorFill,
    MdTranslate,
} from "react-icons/md";

export enum TOOLS_ON_SELECTION {
    HIGHLIGHT = "highlight",
    NOTE = "note",
    UNDERLINE = "underline",
    VOCABULARY = "vocabulary",
}
export enum OTHER_TOOLS {
    BRUSH = "brush",
}
export const PDF_TOOLS = { ...TOOLS_ON_SELECTION, ...OTHER_TOOLS };
export type PdfTool = typeof PDF_TOOLS[keyof typeof PDF_TOOLS];
type ToolButtonItem = {
    readonly icon: React.JSX.Element;
    readonly id: PdfTool;
};
export const TOOLS_BUTTONS: Array<ToolButtonItem> = [
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
type ToolButtonProps =
    & ToolButtonItem
    & {
        readonly tool: PdfTool | null;
        readonly onToolSelection: (tool: PdfTool | null) => void;
    };
export const ToolButton = (props: ToolButtonProps) => {
    const { t } = useTranslation();

    return (
        <button
            className={props.id === props.tool ? "selected" : ""}
            onClick={() => props.onToolSelection(props.id === props.tool ? null : props.id)}
            title={t(`views.new.fileEditor.settings.${props.id}`)}
        >
            {props.icon}
        </button>
    );
};
