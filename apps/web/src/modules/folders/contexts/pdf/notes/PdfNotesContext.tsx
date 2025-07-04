import { createContext, useContext } from "react";

import { getContextError } from "@/contexts/utils";

import { PdfNote } from "../../../types";

type PdfNotesContextValue = {
    readonly selectedNote: PdfNote | undefined;
    readonly setSelectedNote: (id: string) => void;
};

export const PdfNotesContext = createContext<PdfNotesContextValue | null>(null);

export const usePdfNotes = () => {
    const ctx = useContext(PdfNotesContext);

    if (!ctx) {
        throw new Error(getContextError("usePdfNotes", "PdfNotesProvider"));
    }

    return (ctx);
};
