import { createContext, Dispatch, ReactNode, SetStateAction, useContext } from "react";

import { getContextError } from "@/contexts/utils";
import { RgbColor } from "@/utils";

import { PDF_TOOLS } from "../../../types";

export type PdfTool = typeof PDF_TOOLS[keyof typeof PDF_TOOLS];
export type PdfToolsContextType = {
    readonly color: RgbColor;
    readonly currentRange: Range | undefined;
    readonly customCursor: ReactNode;
    readonly onContextMenu: (e: MouseEvent) => void;
    readonly onToolSelection: (tool: PdfTool | null) => void;
    readonly setColor: Dispatch<SetStateAction<RgbColor>>;
    readonly setTool: Dispatch<SetStateAction<PdfTool | null>>;
    readonly tool: PdfTool | null;
};

export const PdfToolsContext = createContext<PdfToolsContextType | null>(null);

export const usePdfTools = () => {
    const context = useContext(PdfToolsContext);

    if (!context) {
        throw new Error(getContextError("usePdfTools", "PdfToolsProvider"));
    }

    return (context);
};
