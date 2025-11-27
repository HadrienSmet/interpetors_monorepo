import { PdfMetadata } from "@repo/types";

export type FileData = {
    readonly fileInStructure: PdfMetadata | null;
    readonly path: string;
};
