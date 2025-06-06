import { ChangeEvent, useMemo, useState } from "react";
import { MdClear, MdEdit, MdLink } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Accordion, Button } from "@/components";
import { NoteData, useNotes } from "@/contexts";
import { useColorPanel } from "@/hooks";
import { getRgbFromString } from "@/utils";

import "./notes.scss";

type NoteProps = {
    readonly index: number;
    readonly note: NoteData;
};
const Note = ({ note, index }: NoteProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(note.note);

    const { deleteNote, updateNote } = useNotes();
    const { t } = useTranslation();

    const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value)
    const onClick = () => {
        updateNote(note.color, note.id, inputValue);
        setIsEditing(false);
    };
    const onDelete = () => deleteNote(note.color, note.id);
    const toggleEditing = () => setIsEditing(state => !state);

    return (
        <div
            className="note"
            id={`${Object.values(getRgbFromString(note.color)).join("-")}-${index + 1}`}
        >
            {note.reference && (
                <div className="note-header">
                    <Link to={`/prepare/files?filepath=${note.reference.filePath}`}>
                        <MdLink />
                        {note.reference.filePath}
                    </Link>
                    <div className="note-header-buttons">
                        <MdEdit onClick={toggleEditing} />
                        <MdClear onClick={onDelete} />
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
                            onChange={onChange}
                        />
                        <Button
                            onClick={onClick}
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
    readonly group: Record<string, NoteData>;
};
const NoteGroup = ({ group }: NoteGroupProps) => (
    <div className="note-group__content">
        {Object.values(group).map((noteData, index) => (
            <Note key={`note-${noteData.color}-${noteData.id}`} note={noteData} index={index} />
        ))}
    </div>
);

export const Notes = () => {
    const { colorPanel } = useColorPanel();
    const { notes } = useNotes();
    const { t } = useTranslation();

    const accordionItems = useMemo(() => {
        const keys = Object.keys(notes);

        if (keys.length < 1) {
            return (null);
        }

        const output = [];
        let index = 0;
        for (const key of keys) {
            const content = (
                <NoteGroup
                    group={notes[key]}
                    key={`group-${key}`}
                />
            );

            const title = (
                <div
                    className="note-group__title"
                    key={`group-${key}-title`}
                >
                    <div
                        className="note-group__color"
                        style={{ backgroundColor: key }}
                    />
                    <h2>{colorPanel?.colors[key] ?? `Group ${index + 1}`}</h2>
                </div>
            );

            output.push({ title, content });

            index++;
        }

        return (output);
    }, [notes]);

    return (
        <section className="notes">
            {accordionItems
                ? (<Accordion items={accordionItems} />)
                : (
                    <div className="message-container">
                        <p>{t("notes.empty")}</p>
                    </div>
                )
            }
        </section>
    );
};
