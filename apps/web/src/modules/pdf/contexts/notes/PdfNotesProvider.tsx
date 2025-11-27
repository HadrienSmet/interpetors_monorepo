import { PropsWithChildren, useMemo, useState } from "react";

import { useFoldersActions, useFoldersManager } from "@/modules/folders";

import { usePdfFile } from "../file";

import { PdfNotesContext } from "./PdfNotesContext";

export const PdfNotesProvider = ({ children }: PropsWithChildren) => {
    const [id, setSelectedNote] = useState("");

    const { getPageActions } = useFoldersActions();
    const { selectedFile } = useFoldersManager();
    const { pageIndex } = usePdfFile();

    const selectedNote = useMemo(() => {
        if (id === "" || !selectedFile.fileInStructure) {
            return (undefined);
        }

        const fileActions = getPageActions(selectedFile.fileInStructure.id, pageIndex);
        const output = fileActions.generatedResources?.find(note => note.id === id);

        return (output);
    }, [id, selectedFile]);

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
