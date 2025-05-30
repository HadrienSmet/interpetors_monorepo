import { FolderStructure } from "@/contexts";

export type TreeNodeProps = {
    readonly depth: number;
    readonly name: string;
    readonly node: FolderStructure | File;
    readonly onFileClick: (file: File, path: string) => void;
    readonly path: string;
    readonly selectedFile: File | null;
};
