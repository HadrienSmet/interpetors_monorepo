import { PdfFile } from "../files";

export type FolderStructure = {
    [key: string]: PdfFile | FolderStructure;
}
