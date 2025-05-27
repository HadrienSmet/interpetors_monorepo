import { useState } from "react";
import { MdClear, MdEdit, MdExpandLess, MdExpandMore, MdLink } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Button, GradientBackground } from "@/components";
import { NoteData, useNotes } from "@/contexts";

import "./notes.scss";

type NoteProps = {
    readonly note: NoteData;
};
const Note = ({ note }: NoteProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(note.note);

    const { updateNote } = useNotes();
    const { t } = useTranslation();

    return (
        <div className="note">
            {note.reference && (
                <div className="note-header">
                    <Link to={`/prepare/files?filepath=${note.reference.filePath}`}>
                        <MdLink />
                        {note.reference.filePath}
                    </Link>
                    <div className="note-header-buttons">
                        <MdEdit onClick={() => setIsEditing(state => !state)} />
                        <MdClear />
                    </div>
                </div>
            )}
            {note.reference && (
                <em>"{note.reference.text}"</em>
            )}
            {note.note === "" || isEditing
                ? (
                    <div className="note-input-container">
                        <textarea
                            autoFocus
                            name="note"
                            defaultValue={note.note}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <Button
                            onClick={() => updateNote(note.color, note.id, inputValue)}
                            label={t("actions.confirm")}
                        />
                    </div>
                )
                : (<p>{note.note}</p>)
            }
        </div>
    );
};
type NoteGroupProps = {
    readonly color: string;
    readonly group: Record<string, NoteData>;
    readonly index: number;
};
const NoteGroup = ({ color, group, index }: NoteGroupProps) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleExpansion = () => setIsExpanded(state => !state);

    return (
        <div
            className="note-group"
            style={{ borderLeftColor: color }}
        >
            <GradientBackground color={color} />
            <div className="note-group-header">
                <h2>Group {index + 1}</h2>
                <button
                    onClick={toggleExpansion}
                >
                    {isExpanded
                        ? <MdExpandLess size={24} />
                        : <MdExpandMore size={24} />
                    }
                </button>
            </div>
            {isExpanded && (
                <div className="note-group-notes">
                    {Object.values(group).map(noteData => (
                        <Note key={`note-${noteData.color}-${noteData.id}`} note={noteData} />
                    ))}
                </div>
            )}
        </div>
    );
};

export const Notes = () => {
    const { notes } = useNotes();
    const { t } = useTranslation();

    return (
        <section className="notes">
            {Object.keys(notes).length > 0
                ? (Object.keys(notes).map((key, index) => (
                    <NoteGroup
                        color={key}
                        group={notes[key]}
                        index={index}
                        key={`group-${key}`}
                    />
                )))
                : (
                    <div className="message-container">
                        <p>{t("notes.empty")}</p>
                    </div>
                )
            }
        </section>
    );
};
