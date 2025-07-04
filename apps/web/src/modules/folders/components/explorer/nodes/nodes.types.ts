import { FileInStructure, FolderStructure } from "../../../types";

export type TreeNodeProps = {
    readonly depth: number;
    readonly name: string;
    readonly node: FolderStructure | FileInStructure;
    readonly path: string;
};
