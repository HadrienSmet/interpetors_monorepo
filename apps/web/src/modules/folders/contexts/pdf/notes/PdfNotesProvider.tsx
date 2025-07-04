import { PropsWithChildren, useMemo, useState } from "react";

import { useFoldersManager } from "../../manager";

import { usePdfFile } from "../file";

import { PdfNotesContext } from "./PdfNotesContext";

export const PdfNotesProvider = ({ children }: PropsWithChildren) => {
    const [noteId, setSelectedNote] = useState("");

    const { selectedFile } = useFoldersManager();
    const { pageIndex } = usePdfFile();

    const selectedNote = useMemo(() => {
        if (noteId === "" || !selectedFile.fileInStructure) {
            return (undefined);
        }

        const output = selectedFile.fileInStructure.elements[pageIndex].notes.find(note => note.id === noteId);

        return (output);
    }, [noteId, selectedFile]);

    const value = {
        selectedNote,
        setSelectedNote,
    };

    return (
        <PdfNotesContext.Provider value={value}>
            {children}
        </PdfNotesContext.Provider>
    );
};
