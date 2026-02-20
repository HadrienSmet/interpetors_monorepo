import { MdBorderColor, MdBrush, MdComment, MdFormatColorFill, MdOutlineMenuBook } from "react-icons/md";

import { FILE_TOOLS, FileTool, Position } from "@repo/types";

import "./customCursor.scss";

const CURSOR_SIZE = 6 as const;
const ICON_SIZE = 24 as const;

type ToolIconParams = {
    readonly color: string;
    readonly style: React.CSSProperties;
};

type CustomCursorProps = {
    readonly color: string;
	readonly opacity: number;
    readonly position: Position;
    readonly tool: FileTool;
};
// TODO: Need to have one source of truth for tools icons
const TOOLS_ICONS = {
    [FILE_TOOLS.BRUSH]: (params: ToolIconParams) => <MdBrush {...params} />,
    [FILE_TOOLS.HIGHLIGHT]: (params: ToolIconParams) => <MdFormatColorFill {...params} />,
    [FILE_TOOLS.NOTE]: (params: ToolIconParams) => <MdComment {...params} />,
    [FILE_TOOLS.UNDERLINE]: (params: ToolIconParams) => <MdBorderColor {...params} />,
    [FILE_TOOLS.VOCABULARY]: (params: ToolIconParams) => <MdOutlineMenuBook {...params} />,
};
const getCursrorIcon = ({ color, tool }: Omit<CustomCursorProps, "position" | "opacity">) => {
    const toolIcon = TOOLS_ICONS[tool];

    const style: React.CSSProperties = {
        height: ICON_SIZE,
        width: ICON_SIZE,
    };

    return (toolIcon({ color, style }));
};

export const CustomCursor = ({ color, opacity, position, tool }: CustomCursorProps) => (
    <div
        className="custom-cursor"
        style={{
            left: position.x - (CURSOR_SIZE/2),
			opacity,
            top: position.y - (ICON_SIZE/2),
        }}
    >
        <div
            className="custom-cursor-indicator"
            style={{ backgroundColor: color }}
        />
        {getCursrorIcon({ color, tool })}
    </div>
);
