import { rgb } from "pdf-lib";
import { v4 as uuidv4 } from "uuid";

import { FileInStructure, NoteData } from "@/contexts";
import { RgbColor } from "@/utils";
import { PDFDocument } from "@/workers/pdfConfig";

import { PDF_TYPE } from "./constants";

export const getFileFromPdfDocument = async (pdfDoc: PDFDocument, pdfFile: FileInStructure): Promise<FileInStructure> => {
    const updatedBytes = await pdfDoc.save();

    const updatedBlob = new Blob([updatedBytes], PDF_TYPE);
    const updatedFile = new File([updatedBlob], pdfFile.name, PDF_TYPE);

    return ({
        ...pdfFile,
        file: updatedFile,
    });
}
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
export const getPdfColor = (color: RgbColor) => rgb(color.r, color.g, color.b);
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
