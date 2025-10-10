import { FileAction } from "./actions";

export type PdfFile = {
    readonly actions: Record<number, FileAction>;
    readonly file: File;
    readonly name: string;
};
