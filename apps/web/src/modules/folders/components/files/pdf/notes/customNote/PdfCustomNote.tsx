import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { usePdfHistory, usePdfNotes } from "../../../../../contexts";
import { PdfNote } from "../../../../../types";

import "./pdfCustomNote.scss";

type NoteProps = {
    readonly note: PdfNote;
}
export const PdfCustomNote = ({ note }: NoteProps) => {
    const [isReading, setIsReading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [noteContent, setNoteContent] = useState("");

    const { selectedNote, setSelectedNote } = usePdfNotes();

    useEffect(() => {
        if (selectedNote?.id === note.id) {
            setIsReading(true);
            setSelectedNote("");
        }
    }, [note, selectedNote]);

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
    const onMouseEnter = () => {
        if (note.note === "") {
            return;
        }

        document
            .querySelectorAll(`.note-group-${note.id}`)
            .forEach(el => el.classList.add("hovered"));
    };
    const onMouseLeave = () => {
        document
            .querySelectorAll(`.note-group-${note.id}`)
            .forEach(el => el.classList.remove("hovered"));
    };
    const toggleReadMode = () => setIsReading(state => !state);

    const splittedId = note.id.split("-");
    const noteIndex = splittedId[splittedId.length-1];

    return (
        <div
            className="document-note"
            id={note.id}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{ top: note.y }}
        >
            <div
                className="document-note-indicator"
                style={{ backgroundColor: note.color }}
            />
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
                : (
                    <button
                        className={isReading ? "" : "cropping"}
                        onClick={toggleReadMode}
                        onDoubleClick={() => setIsUpdating(true)}
                        title={`${t("notes.readOnClick")}\n${t("actions.editOnDoubleClick")}`}
                    >
                        {note.note}
                    </button>
                )
            }
        </div>
    );
};
