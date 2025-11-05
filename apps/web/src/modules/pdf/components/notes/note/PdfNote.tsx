import { ChangeEvent, KeyboardEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Note } from "@repo/types";

import { useColorPanel } from "@/modules/colorPanel";
import { usePdfHistory, usePdfNotes } from "@/modules/pdf";
import { getRgbColor, handleActionColor } from "@/utils";

import "./pdfNote.scss";

type PdfNoteProps = {
    readonly note: Note;
};
export const PdfNote = ({ note }: PdfNoteProps) => {
    const [isReading, setIsReading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [noteContent, setNoteContent] = useState("");

    const { colorPanel } = useColorPanel();
    const { updateNoteInHistory } = usePdfHistory();
    const { selectedNote, setSelectedNote } = usePdfNotes();
    const { t } = useTranslation();

    useEffect(() => {
        if (selectedNote?.id === note.id) {
            setIsReading(true);
            setSelectedNote("");
        }
    }, [note, selectedNote]);

    const splittedId = note.id.split("-");
    const noteIndex = splittedId[splittedId.length-1];
    const noteColor = useMemo(() => (handleActionColor(note.color, colorPanel)), [note.color, colorPanel]);
    const noteColorStr = getRgbColor(noteColor);

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
                style={{ backgroundColor: noteColorStr }}
            />
            <p>{noteIndex}</p>
            {(note.note === "" || isUpdating)
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
