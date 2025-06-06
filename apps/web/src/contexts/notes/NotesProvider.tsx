import { PropsWithChildren, useState } from "react";

import { NoteData, NotesContext, NotesRecord } from "./NotesContext";

export const NotesProvider = ({ children }: PropsWithChildren) => {
    const [notes, setNotes] = useState<NotesRecord>({});

    const createNote = (note: NoteData) => setNotes(state => {
        const copy = { ...state };

        if (!(note.color in copy)) {
            copy[note.color] = {};
        }

        copy[note.color][note.id] = note;

        return (copy);
    });
    const deleteNote = (color: string, id: string) => setNotes(state => {
        const copy = { ...state };

        delete copy[color][id];

        return (copy);
    });
    const updateNote = (color: string, id: string, note: string) => setNotes(state => {
        const copy = { ...state };

        const updated = {
            ...copy[color][id],
            note,
        };

        return ({
            ...copy,
            [color]: {
                ...copy[color],
                [id]: updated,
            },
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
