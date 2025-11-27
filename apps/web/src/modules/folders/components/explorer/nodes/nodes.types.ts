import type { FolderStructure, PdfMetadata } from "@repo/types";

export type TreeNodeProps = {
    readonly depth: number;
    readonly name: string;
    readonly node: FolderStructure | PdfMetadata;
    readonly path: string;
};
