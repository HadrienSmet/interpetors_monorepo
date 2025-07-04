import { useMemo } from "react";

import { useFoldersManager, usePdfFile } from "../../../../contexts";
import { PdfNote } from "../../../../types";

import { GroupedNotes } from "./grouped";

import "./notesDisplayer.scss";

export const NotesDisplayer = () => {
    const { selectedFile } = useFoldersManager();
    const { pageIndex } = usePdfFile();

    const grouped = useMemo(() => {
        const output: Record<string, Array<PdfNote>> = {};

        if (!selectedFile.fileInStructure) {
            return (output);
        }

        for (const note of selectedFile.fileInStructure.elements[pageIndex].notes) {
            if (!(note.y in output)) {
                output[note.y] = [note];
            } else {
                output[note.y].push(note);
            }
        }

        return (output);
    }, [selectedFile.fileInStructure, pageIndex]);

    return (
        <div className="document-notes-displayer">
            {Object.keys(grouped).map(key => (
                <GroupedNotes
                    key={key}
                    group={grouped[key]}
                    y={Number(key)}
                />
            ))}
        </div>
    );
};
