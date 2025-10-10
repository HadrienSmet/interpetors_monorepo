import { ActionColor } from "../colors";

type NoteOccurence = {
    readonly filePath: string;
    readonly text: string;
};
export type Note = {
    readonly color: ActionColor;
    readonly id: string;
    readonly occurence: NoteOccurence;
    readonly note: string;
    readonly y: number;
};
