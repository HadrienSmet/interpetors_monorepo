import { useNavigate } from "react-router-dom";

import { NoteInStructure } from "../../../../contexts";

import "./textIneractive.scss";

type TextInteractiveProps = {
    readonly i: number;
    readonly index: number;
    readonly note: NoteInStructure;
};
export const TextInteractive = ({ note, index, i }: TextInteractiveProps) => {
    const navigate = useNavigate();

    const onClick = () => {
        navigate(`/prepare/notes?note=${note.noteId}`);
    };
    const onMouseEnter = () => {
        document
            .querySelectorAll(`.note-group-${note.noteId}`)
            .forEach(el => el.classList.add("hovered"));
    };
    const onMouseLeave = () => {
        document
            .querySelectorAll(`.note-group-${note.noteId}`)
            .forEach(el => el.classList.remove("hovered"));
    };

    return (
        <button
            className={`note-ref-overlay note-group-${note.noteId}`}
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
