import { useTranslation } from "react-i18next";
import {
    MdBorderColor,
    MdBrush,
    MdComment,
    MdFormatColorFill,
    MdOutlineMenuBook,
} from "react-icons/md";

export enum PDF_TOOLS {
    BRUSH = "brush",
    HIGHLIGHT = "highlight",
    NOTE = "note",
    UNDERLINE = "underline",
    VOCABULARY = "vocabulary",
}
type ToolButtonProps = {
    readonly icon: JSX.Element;
    readonly id: PDF_TOOLS;
};
export const TOOLS_BUTTONS: Array<ToolButtonProps> = [
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
        icon: <MdOutlineMenuBook />,
        id: PDF_TOOLS.VOCABULARY,
    },
];
export const ToolButton = (props: ToolButtonProps & { tool: PDF_TOOLS | null; setTool: (tool: PDF_TOOLS) => void; }) => {
    const { t } = useTranslation();

    return (
        <button
            className={props.id === props.tool ? "selected" : ""}
            onClick={() => props.setTool(props.id)}
            title={t(`views.new.fileEditor.settings.${props.id}`)}
        >
            {props.icon}
        </button>
    );
};
