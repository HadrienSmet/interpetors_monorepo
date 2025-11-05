import { PdfFile } from "@repo/types";

export type FileData = {
    readonly fileInStructure: PdfFile | null;
    readonly path: string;
};
