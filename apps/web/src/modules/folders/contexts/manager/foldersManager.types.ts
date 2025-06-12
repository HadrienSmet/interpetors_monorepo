import { PdfFileInStructure } from "../pdf";

export type FileInStructure = PdfFileInStructure;
export type FolderStructure = {
    [key: string]: FileInStructure | FolderStructure;
};
