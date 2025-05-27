import { createContext, useContext } from "react";

import { getContextError } from "../utils";

export type NoteReference = {
    readonly file: File;
    readonly filePath: string;
    readonly text: string;
};
export type NoteData = {
    readonly color: string;
    readonly createdAt: number;
    readonly id: string;
    readonly note: string;
    readonly reference?: NoteReference;
};
/** Color indexed then id indexed */
export type NotesRecord = Record<string, Record<string, NoteData>>;
type NotesContextType = {
    /** Color indexed then id indexed  */
    readonly notes: NotesRecord;

    readonly createNote: (note: NoteData) => void;
    readonly deleteNote: (color: string, id: string) => void;
    readonly updateNote: (color: string, id: string, note: string) => void;
};

export const NotesContext = createContext<NotesContextType | null>(null);

export const useNotes = () => {
    const context = useContext(NotesContext);

    if (!context) {
        throw new Error(getContextError("useNotes", "NotesProvider"));
    }

    return (context);
};
