import { FileInStructure, FolderStructure } from "../../../types";

export type TreeNodeProps = {
    readonly depth: number;
    readonly name: string;
    readonly node: FolderStructure | FileInStructure;
    readonly onFileClick: (file: FileInStructure, path: string) => void;
    readonly path: string;
    readonly selectedFile: File | null;
};
