import { createContext, Dispatch, SetStateAction, useContext } from "react";

import { Note } from "@repo/types";

import { getContextError } from "@/contexts/utils";

type PdfNotesContextValue = {
    readonly selectedNote: Note | undefined;
    readonly setSelectedNote: Dispatch<SetStateAction<string>>;
};

export const PdfNotesContext = createContext<PdfNotesContextValue | null>(null);

export const usePdfNotes = () => {
    const ctx = useContext(PdfNotesContext);

    if (!ctx) {
        throw new Error(getContextError("usePdfNotes", "PdfNotesProvider"));
    }

    return (ctx);
};
