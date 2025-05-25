import { createContext, useContext } from "react";

import { getContextError } from "../utils";

export type NoteReference = {
    readonly file: File;
    readonly filePath: string;
    readonly text: string;
};
export type NoteData = {
    readonly id: string;
    readonly note: string;
    readonly reference?: NoteReference;
};
export type NotesRecord = Record<string, NoteData>;
type NotesContextType = {
    /** Id indexed record */
    readonly notes: NotesRecord;

    readonly createNote: (note: NoteData) => void;
    readonly deleteNote: (id: string) => void;
    readonly updateNote: (id: string, note: string) => void;
};

export const NotesContext = createContext<NotesContextType | null>(null);

export const useNotes = () => {
    const context = useContext(NotesContext);

    if (!context) {
        throw new Error(getContextError("useNotes", "NotesProvider"));
    }

    return (context);
};
