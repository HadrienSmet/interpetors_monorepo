import { ChangeEvent, KeyboardEvent, useState } from "react";

import { useFoldersManager } from "@/contexts";

import { FileIcon } from "../../../files";
import { InputStyleLess } from "../../../ui";

import { TreeNodeProps } from "./nodes.types";
import { getPaddingLeft } from "./nodes.utils";

type FileNodeProps =
    & Omit<TreeNodeProps, "node" | "path">
    & { readonly node: File; };
export const FileNode = ({ depth, name, node, onFileClick, selectedFile }: FileNodeProps) => {
    const [isEditingFile, setIsEditingFile] = useState(false);
    const [newFileName, setNewFileName] = useState(name);

    const { files } = useFoldersManager();

    const handleRename = () => {
        if (newFileName.trim() && newFileName !== node.name)
            files.changeName(node, newFileName.trim());

        setIsEditingFile(false);
    };

    const onChange = (e: ChangeEvent<HTMLInputElement>) => setNewFileName(e.target.value);
    const onClick = () => onFileClick(node);
    const onDoubleClick = () => setIsEditingFile(true);
    const onDragStart = (e: React.DragEvent<HTMLDivElement>) => e.dataTransfer.setData(
        "application/json",
        JSON.stringify({ fileName: node.name })
    );
    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleRename();
    };

    return (
        <div
            className={`folders-explorer__item ${(selectedFile && node.name === selectedFile.name) ? "selected" : ""}`}
            draggable
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            onDragStart={onDragStart}
            style={{ paddingLeft: getPaddingLeft(depth) }}
        >
            {isEditingFile
                ? (
                    <>
                        <FileIcon node={node} />
                        <InputStyleLess
                            autoFocus
                            name="file-name-input"
                            onChange={onChange}
                            onKeyDown={onKeyDown}
                            value={newFileName}
                        />
                    </>
                )
                : (
                    <>
                        <FileIcon node={node} />
                        <p>{name}</p>
                    </>
                )
            }
        </div>
    );
};
