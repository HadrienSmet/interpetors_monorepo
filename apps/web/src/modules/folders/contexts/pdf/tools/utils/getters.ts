import { v4 as uuidv4 } from "uuid";

import { NoteData } from "@/contexts";

type CreateNoteFromRangeParams = {
    readonly color: string;
    readonly file: File;
    readonly filePath: string;
    readonly range: Range;
};
export const getNoteFromRange = ({ color, file, filePath, range }: CreateNoteFromRangeParams) => {
    const text = range.toString().trim();
    if (!text) return;

    const noteData: NoteData = {
        color,
        createdAt: Date.now(),
        // TODO: Id should be defined in back-end
        id: uuidv4(),
        note: "",
        reference: {
            file,
            filePath,
            text,
        },
    };

    return (noteData);
};
export const getRange = () => {
    const selection = document.getSelection();
    if (!selection || selection.isCollapsed) {
        return;
    };

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText.trim()) {
        return;
    }

    return (range);
};
