import { useEffect } from "react";
import { usePdfNotes } from "../../../../../contexts";
import { NoteElement } from "../../../../../types";

import "./interactiveNote.scss";

type InteractiveNoteProps = {
    readonly i: number;
    readonly index: number;
    readonly note: NoteElement;
};
export const InteractiveNote = ({ note, index, i }: InteractiveNoteProps) => {
    useEffect(() => {console.log({ note })}, [note]);
    const { setSelectedNote } = usePdfNotes();

    const onClick = () => setSelectedNote(note.id);
    const onMouseEnter = () => {
        document
            .querySelectorAll(`.note-group-${note.id}`)
            .forEach(el => el.classList.add("hovered"));
    };
    const onMouseLeave = () => {
        document
            .querySelectorAll(`.note-group-${note.id}`)
            .forEach(el => el.classList.remove("hovered"));
    };

    return (
        <button
            data-ignore-outside-click
            className={`text-interactive note-group-${note.id}`}
            key={`noteRef-${index}-${i}`}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{
                height: `${note.height}px`,
                left: `${note.x}px`,
                top: `${note.y}px`,
                width: `${note.width}px`,
            }}
            title="Navigate to note"
        />
    );
};
