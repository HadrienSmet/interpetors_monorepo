import type { ClientFolderStructure, ClientPdfFile } from "@repo/types";

export type TreeNodeProps = {
    readonly depth: number;
    readonly name: string;
    readonly node: ClientFolderStructure | ClientPdfFile;
    readonly path: string;
};
