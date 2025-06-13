import { MdBorderColor, MdBrush, MdComment, MdFormatColorFill, MdOutlineMenuBook } from "react-icons/md";

import { Position } from "@/types";

import { PdfTool } from "../../../contexts";
import { PDF_TOOLS } from "../../../types";

import "./customCursor.scss";

const CURSOR_SIZE = 6 as const;
const ICON_SIZE = 24 as const;

type ToolIconParams = {
    readonly color: string;
    readonly style: React.CSSProperties;
};

type CustomCursorProps = {
    readonly color: string;
    readonly position: Position;
    readonly tool: PdfTool;
};
// TODO: Need to have one source of truth for tools icons
const TOOLS_ICONS = {
    [PDF_TOOLS.BRUSH]: (params: ToolIconParams) => <MdBrush {...params} />,
    [PDF_TOOLS.HIGHLIGHT]: (params: ToolIconParams) => <MdFormatColorFill {...params} />,
    [PDF_TOOLS.NOTE]: (params: ToolIconParams) => <MdComment {...params} />,
    [PDF_TOOLS.UNDERLINE]: (params: ToolIconParams) => <MdBorderColor {...params} />,
    [PDF_TOOLS.VOCABULARY]: (params: ToolIconParams) => <MdOutlineMenuBook {...params} />,
};
const getCursrorIcon = ({ color, tool }: Omit<CustomCursorProps, "position">) => {
    const toolIcon = TOOLS_ICONS[tool];

    const style: React.CSSProperties = {
        height: ICON_SIZE,
        width: ICON_SIZE,
    };

    return (toolIcon({ color, style }));
};

export const CustomCursor = ({ color, position, tool }: CustomCursorProps) => (
    <div
        className="custom-cursor"
        style={{
            left: position.x - (CURSOR_SIZE/2),
            top: position.y - (ICON_SIZE/2),
        }}
    >
        <div
            className="custom-cursor-indicator"
            style={{ backgroundColor: color, }}
        />
        {getCursrorIcon({ color, tool })}
    </div>
);
