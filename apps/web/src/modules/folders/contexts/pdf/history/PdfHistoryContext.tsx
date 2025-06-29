import { createContext, useContext } from "react";

import { getContextError } from "@/contexts/utils";

import { ElementAction, GenerateElementAction, InterractiveReferenceAction } from "../../../types";

export type HistoryAction = {
    /** Used to get the pdf and the canvas elemnts */
    readonly elements: Array<ElementAction>;
    readonly elementToGenerate?: GenerateElementAction;
    /** Text highlighted on hover */
    readonly interractiveText?: InterractiveReferenceAction;
};

export type PdfHistoryContextType = {
    /** Decrease history index */
    readonly backward: () => void;
    /** Increase history index */
    readonly forward: () => void;
    readonly historyIndex: number;
    readonly isUpToDate: boolean;
    /** Adds the last user action at the right history index */
    readonly pushAction: (action: HistoryAction) => void;
    readonly updateNoteInHistory: (color: string, id: string, text: string) => void;
};

export const PdfHistoryContext = createContext<PdfHistoryContextType | null>(null);

export const usePdfHistory = () => {
    const context = useContext(PdfHistoryContext);

    if (!context) {
        throw new Error(getContextError("usePdfHistory", "PdfHistoryProvider"));
    }

    return (context);
};
