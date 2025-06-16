import { createContext, useContext } from "react";

import { getContextError } from "@/contexts/utils";

import { ElementAction, ReferenceAction } from "../types";

export type HistoryAction = {
    readonly elements: Array<ElementAction>;
    readonly reference?: ReferenceAction;
};
export type SortedActions = {
    readonly elements: Array<ElementAction>;
    readonly references: Array<ReferenceAction>;
};
export type PdfHistoryContextType = {
    /** Decrease history index */
    readonly backward: () => void;
    /** Increase history index */
    readonly forward: () => void;
    readonly isUpToDate: boolean;
    readonly historyIndex: number;
    /** Adds the last user action at the right history index */
    readonly pushAction: (action: HistoryAction) => void;
};

export const PdfHistoryContext = createContext<PdfHistoryContextType | null>(null);

export const usePdfHistory = () => {
    const context = useContext(PdfHistoryContext);

    if (!context) {
        throw new Error(getContextError("usePdfHistory", "PdfHistoryProvider"));
    }

    return (context);
};
