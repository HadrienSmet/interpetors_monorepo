import { ChangeEvent, KeyboardEvent, MouseEvent, useMemo, useState } from "react";
import { MdDelete, MdDriveFileRenameOutline, MdTranslate } from "react-icons/md";
import { useTranslation } from "react-i18next";

import { PdfMetadata } from "@repo/types";

import { InputStyleLess } from "@/components";
import { useContextMenu } from "@/contexts";
import { FileIcon } from "@/modules/files";
import { LANGUAGES_STATE, useFoldersManager } from "@/modules/folders";

import { TreeNodeProps } from "../nodes.types";
import { getPaddingLeft } from "../nodes.utils";

export const handleDynamicEvent = (execute: boolean, fn: () => void) => {
    if (!execute) return;

    fn();
};
export type FileNodeProps =
    & Omit<TreeNodeProps, "node">
    & { readonly node: PdfMetadata; };
export const FileNode = ({
    depth,
    name,
    node,
    path,
}: FileNodeProps) => {
    const [isEditingFile, setIsEditingFile] = useState(false);
    const [newFileName, setNewFileName] = useState(name);

    const { setContextMenu } = useContextMenu();
    const { files, isEditable, selectedFile, setLanguagesState, setSelectedFilePath } = useFoldersManager();
    const { t } = useTranslation();

    const items = [
        {
            children: (
                <>
                    <MdDriveFileRenameOutline />
                    <p>{t("files.context-menu.rename")}</p>
                </>
            ),
            onClick: () => setIsEditingFile(true),
        },
        {
            children: (
                <>
                    <MdDelete />
                    <p>{t("files.context-menu.delete")}</p>
                </>
            ),
            onClick: () => files.delete(node),
        },
        {
            children: (
                <>
                    <MdTranslate />
                    <p>{t("files.context-menu.language")}</p>
                </>
            ),
            onClick: () => setLanguagesState(LANGUAGES_STATE.OPTIONAL),
        },
    ];

    const handleRename = () => {
        if (newFileName.trim() && newFileName !== node.name) {
            files.rename(node, newFileName.trim());
        }

        setIsEditingFile(false);
    };

    const onChange = (e: ChangeEvent<HTMLInputElement>) => setNewFileName(e.target.value);
    const onClick = () => setSelectedFilePath(path);
    const onContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setContextMenu({ x: e.clientX, y: e.clientY }, items);
    };
    const onDoubleClick = () => setIsEditingFile(true);
    const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();

        e.dataTransfer.setData(
            "application/json",
            JSON.stringify({ fileName: node.name })
        );
    };
    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleRename();
    };

    const isSelected = useMemo(() => (
        selectedFile && node.name === selectedFile.fileInStructure?.name
    ), [selectedFile.fileInStructure?.name, node.name]);

    return (
        <div
            className={`folders-explorer__item ${isSelected ? "selected" : ""}`}
            draggable
            onBlur={() => handleDynamicEvent(isEditable, () => setIsEditingFile(false))}
            onClick={onClick}
            onContextMenu={(e) => handleDynamicEvent(isEditable, () => onContextMenu(e))}
            onDoubleClick={() => handleDynamicEvent(isEditable, onDoubleClick)}
            onDragStart={(e) => handleDynamicEvent(isEditable, () => onDragStart(e))}
            style={{ paddingLeft: getPaddingLeft(depth) }}
        >
            <FileIcon node={node.file} />
            {(isEditable && isEditingFile)
                ? (
                    <InputStyleLess
                        autoFocus
                        name="file-name-input"
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        value={newFileName}
                    />
                )
                : (<p>{name}</p>)
            }
        </div>
    );
};
