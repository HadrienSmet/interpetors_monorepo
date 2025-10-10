export enum TOOLS_ON_SELECTION {
    HIGHLIGHT = "highlight",
    NOTE = "note",
    UNDERLINE = "underline",
    VOCABULARY = "vocabulary",
}
export enum OTHER_TOOLS {
    BRUSH = "brush",
}

export const FILE_TOOLS = { ...TOOLS_ON_SELECTION, ...OTHER_TOOLS };
export type FileTool = typeof FILE_TOOLS[keyof typeof FILE_TOOLS];
