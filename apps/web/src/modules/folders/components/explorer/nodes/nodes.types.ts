import type { FolderStructure, PdfFile } from "@repo/types";

export type TreeNodeProps = {
    readonly depth: number;
    readonly name: string;
    readonly node: FolderStructure | PdfFile;
    readonly path: string;
};
