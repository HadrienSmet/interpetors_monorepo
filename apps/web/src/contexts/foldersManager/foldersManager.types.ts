import { Color } from "pdf-lib";

import { Position } from "@/types";

type PdfElementInStructure = { readonly pageIndex: number; };
export type NoteInStructure =
    & {
        readonly height: number;
        readonly noteId: string;
        readonly pageIndex: number;
        readonly width: number;
    }
    & PdfElementInStructure
    & Position;
export type PathToDraw =
    & {
        readonly options:
            & {
                readonly borderColor: Color;
                readonly borderWidth: number;
                readonly opacity: number;
            }
            & Position;
        readonly path: string;
    }
    & PdfElementInStructure;
export type RectangleToDraw =
    & {
        readonly color: Color;
        readonly height: number;
        readonly opacity: number;
        readonly width: number;
    }
    & PdfElementInStructure
    & Position;
export type TextToDraw =
    & {
        readonly options:
            & {
                readonly color: Color;
                readonly size: number;
            }
            & Position;
        readonly text: string;
    }
    & PdfElementInStructure;
export type InteractionsInStucture = {
    /** List of the new note references. Used to simplify the concatenation */
    noteReferences: Array<NoteInStructure>;
    /** List of the new paths to draw. Used to simplify the concatenation  */
    pathsToDraw: Array<PathToDraw>;
    /** List of the new rectangles to draw. Used to simplify the concatenation  */
    rectanglesToDraw: Array<RectangleToDraw>;
    /** List of the new texts to draw. Used to simplify the concatenation */
    textsToDraw: Array<TextToDraw>;
}
export type FileInteractions = Partial<InteractionsInStucture>;
export type FileInStructure = {
    // TODO back-end Should not be send to back-end
    /** File displayed in the editor and that contains all the modifications */
    file: File;
    /** Name of the file */
    name: string;
    /** Comes from the back-end or will be send to the back-end only the renaming affects him */
    originalFile: File;
} & InteractionsInStucture;
export type FolderStructure = {
    [key: string]: FileInStructure | FolderStructure;
};
