import { createContext, Dispatch, ReactNode, SetStateAction, useContext } from "react";

import { ActionColor, FileTool } from "@repo/types";

import { getContextError } from "@/contexts/utils";

export type PdfToolsContextType = {
	readonly cancelVocabularyCreation: () => void;
    readonly color: ActionColor;
    readonly currentRange: Range | undefined;
    readonly customCursor: ReactNode;
	readonly languageToConfirm: string | undefined;
    readonly onContextMenu: (e: MouseEvent) => void;
    readonly onToolSelection: (tool: FileTool | null) => void;
    readonly setColor: Dispatch<SetStateAction<ActionColor>>;
    readonly setIsCursorVisible: Dispatch<SetStateAction<boolean>>;
	readonly setLanguageToConfirm: Dispatch<SetStateAction<string | undefined>>;
	readonly setLanguageToUse: Dispatch<SetStateAction<string | undefined>>;
    readonly setTool: Dispatch<SetStateAction<FileTool | null>>;
    readonly tool: FileTool | null;
};

export const PdfToolsContext = createContext<PdfToolsContextType | null>(null);

export const usePdfTools = () => {
    const context = useContext(PdfToolsContext);

    if (!context) {
        throw new Error(getContextError("usePdfTools", "PdfToolsProvider"));
    }

    return (context);
};
