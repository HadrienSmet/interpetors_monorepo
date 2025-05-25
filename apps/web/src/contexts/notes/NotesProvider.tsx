import { PropsWithChildren, useState } from "react";
import { NoteData, NotesContext, NotesRecord } from "./NotesContext";

export const NotesProvider = ({ children }: PropsWithChildren) => {
    const [notes, setNotes] = useState<NotesRecord>({});

    const createNote = (note: NoteData) => setNotes(state => ({
        ...state,
        [note.id]: note,
    }));
    const deleteNote = (id: string) => setNotes(state => {
        const copy = { ...state };

        delete copy[id];

        return (copy);
    });
    const updateNote = (id: string, note: string) => setNotes(state => {
        const copy = { ...state };

        const updated = {
            ...copy[id],
            note,
        };

        return ({
            ...copy,
            [id]: updated,
        });
    });

    const value = {
        notes,
        createNote,
        deleteNote,
        updateNote,
    };

    return (
        <NotesContext.Provider value={value}>
            {children}
        </NotesContext.Provider>
    );
};
