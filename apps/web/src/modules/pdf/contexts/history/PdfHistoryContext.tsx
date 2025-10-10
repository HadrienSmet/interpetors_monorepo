import { createContext, useContext } from "react";

import { ActionColor, HistoryAction } from "@repo/types";

import { getContextError } from "@/contexts/utils";

export type PdfHistoryContextType = {
    /** Decrease history index */
    readonly backward: () => void;
    /** Increase history index */
    readonly forward: () => void;
    readonly historyIndex: number;
    readonly isUpToDate: boolean;
    /** Adds the last user action at the right history index */
    readonly pushAction: (action: HistoryAction) => void;
    readonly updateNoteInHistory: (color: ActionColor, id: string, text: string) => void;
    readonly version: number;
};

export const PdfHistoryContext = createContext<PdfHistoryContextType | null>(null);

export const usePdfHistory = () => {
    const context = useContext(PdfHistoryContext);

    if (!context) {
        throw new Error(getContextError("usePdfHistory", "PdfHistoryProvider"));
    }

    return (context);
};
