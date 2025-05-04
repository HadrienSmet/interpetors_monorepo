import { ChangeEvent, KeyboardEvent, MouseEvent, useState } from "react";
import { MdDelete, MdDriveFileRenameOutline } from "react-icons/md";
import { useTranslation } from "react-i18next";

import { useContextMenu, useFoldersManager } from "@/contexts";

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

    const { removeContextMenu, setContextMenu } = useContextMenu();
    const { files } = useFoldersManager();
    const { t } = useTranslation();

    const items = [
        (
            <div
                className="folders-explorer__context-menu-item"
                onClick={() => {
                    setIsEditingFile(true);
                    removeContextMenu();
                }}
            >
                <MdDriveFileRenameOutline />
                <p>{t("views.new.context-menu.file.rename")}</p>
            </div>
        ),
        (
            <div
                className="folders-explorer__context-menu-item"
                onClick={() => {
                    files.delete(node);
                    removeContextMenu();
                }}
            >
                <MdDelete />
                <p>{t("views.new.context-menu.file.delete")}</p>
            </div>
        ),
    ];

    const handleRename = () => {
        if (newFileName.trim() && newFileName !== node.name)
            files.changeName(node, newFileName.trim());

        setIsEditingFile(false);
    };

    const onChange = (e: ChangeEvent<HTMLInputElement>) => setNewFileName(e.target.value);
    const onClick = () => onFileClick(node);
    const onContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setContextMenu({ x: e.clientX, y: e.clientY }, items);
    };
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
            onContextMenu={onContextMenu}
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
