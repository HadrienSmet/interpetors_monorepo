import { ChangeEvent, KeyboardEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { useFoldersManager, usePdfFile, usePdfHistory } from "../../../../contexts";
import { PdfNote } from "../../../../types";

import "./notesDisplayer.scss";

const PdfCustomNote = ({ note }: { note: PdfNote}) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [noteContent, setNoteContent] = useState("");

    const { updateNoteInHistory } = usePdfHistory();
    const { t } = useTranslation();

    const updateNote = () => updateNoteInHistory(note.color, note.id, noteContent);

    const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => setNoteContent(e.target.value);
    const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            updateNote();
            setIsUpdating(false);
        }
    };

    const splittedId = note.id.split("-");
    const noteIndex = splittedId[splittedId.length-1];

    return (
        <div
            className="document-note"
            id={note.id}
            style={{ top: note.y }}
        >
            <p>{noteIndex}</p>
            {(
                note.note === "" ||
                isUpdating
            )
                ? (
                    <textarea
                        autoFocus
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        placeholder={t("notes.placeholder")}
                        value={noteContent}
                    />
                )
                : (<button onDoubleClick={() => setIsUpdating(true)}>{note.note}</button>)
            }
        </div>
    );
};

export const NotesDisplayer = () => {
    const { selectedFile } = useFoldersManager();
    const { pageIndex } = usePdfFile();

    return (
        <div className="document-notes-displayer">
            {selectedFile.fileInStructure?.elements[pageIndex].notes.map(note => (
                <PdfCustomNote
                    key={note.id}
                    note={note}
                />
            ))}
        </div>
    );
};
