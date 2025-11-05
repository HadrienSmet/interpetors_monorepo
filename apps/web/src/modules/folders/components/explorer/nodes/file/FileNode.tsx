import { useMemo } from "react";

import type { PdfFile } from "@repo/types";

import { FileIcon } from "@/modules/files";

import { TreeNodeProps } from "../nodes.types";
import { getPaddingLeft } from "../nodes.utils";

export type FileNodeProps =
    & Omit<TreeNodeProps, "node">
    & { readonly node: PdfFile; };

export const FileNode = ({
    depth,
    name,
    node,
    path,
    selectedFile,
    setSelectedFile,
}: FileNodeProps) => {
    const onClick = () => setSelectedFile({ fileInStructure: node, path });

    const isSelected = useMemo(() => (
        selectedFile && node.name === selectedFile.fileInStructure?.name
    ), [selectedFile.fileInStructure?.name, node.name]);

    return (
        <div
            className={`folders-explorer__item ${isSelected ? "selected" : ""}`}
            onClick={onClick}
            style={{ paddingLeft: getPaddingLeft(depth) }}
        >
            <FileIcon node={node.file} />
            <p>{name}</p>
        </div>
    );
};
