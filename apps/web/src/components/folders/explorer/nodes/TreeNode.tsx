import { ChangeEvent, DragEvent, KeyboardEvent, MouseEvent, useMemo, useRef, useState } from "react";
import { MdCreateNewFolder, MdDelete, MdDriveFileRenameOutline } from "react-icons/md";
import { VscFolder, VscFolderOpened } from "react-icons/vsc";
import { useTranslation } from "react-i18next";

import { InputStyleLess } from "@/components";
import { useContextMenu, useFoldersManager } from "@/contexts";
import { useCssVariable } from "@/hooks";

import { FileNode } from "./FileNode";
import { TreeNodeProps } from "./nodes.types";
import { getPaddingLeft } from "./nodes.utils";

type FolderNodeProps =
    & TreeNodeProps
    & {
        readonly highlightedFolderPath: string | null;
        readonly setHighlightedFolderPath: (path: string | null) => void;
    };
export const TreeNode = ({
    depth,
    highlightedFolderPath,
    name,
    node,
    onFileClick,
    path,
    selectedFile,
    setHighlightedFolderPath,
}: FolderNodeProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isOpen, setIsOpen] = useState(depth === 0);
    const [newFolderName, setNewFolderName] = useState("");
    const [updatedName, setUpdatedName] = useState(name);

    const folderRef = useRef<HTMLDivElement | null>(null);

    const { setContextMenu } = useContextMenu();
    const higlightedColor = useCssVariable("--clr-txt-02");
    const { files, folders } = useFoldersManager();
    const { t } = useTranslation();

    const fullPath = useMemo(
        () => (path ? `${path}/${name}` : name),
        [path, name]
    );
    const isHighlighted = useMemo(
        () => (highlightedFolderPath === fullPath),
        [name, path, highlightedFolderPath]
    );

    const handleCreation = () => {
        const trimmed = newFolderName
            .trim()
            .split("")
            .filter(el => el !== "/")
            .join("");

        if (trimmed) {
            folders.create(trimmed, fullPath);
        }

        setIsCreating(false);
    };
    const handleRename = () => {
        const trimmed = updatedName.trim();

        if (trimmed && trimmed !== node.name) {
            folders.rename(fullPath, trimmed);
        }

        setIsEditing(false);
    };

    const contextMenuItemClick = (action: () => void) => {
        action();
        setHighlightedFolderPath(null);
    };
    const contextMenuItems = [
        {
            children: (
                <>
                    <MdCreateNewFolder />
                    <p>{t("views.new.context-menu.folder.create")}</p>
                </>
            ),
            onClick: () => contextMenuItemClick(() => {
                setIsOpen(true);
                setIsCreating(true);
            }),
        },
        {
            children: (
                <>
                    <MdDriveFileRenameOutline />
                    <p>{t("views.new.context-menu.folder.rename")}</p>
                </>
            ),
            onClick: () => contextMenuItemClick(() => setIsEditing(true)),
        },
        {
            children: (
                <>
                    <MdDelete />
                    <p>{t("views.new.context-menu.folder.delete")}</p>
                </>
            ),
            onClick: () => contextMenuItemClick(() => folders.delete(fullPath)),
        },
    ];

    // ----- Events ------
    const onChange = (e: ChangeEvent<HTMLInputElement>) => setUpdatedName(e.target.value);
    const onClick = () => setIsOpen(!isOpen);
    const onContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setHighlightedFolderPath(fullPath);
        setContextMenu({ x: e.clientX, y: e.clientY }, contextMenuItems);
    };
    const onCreateChange = (e: ChangeEvent<HTMLInputElement>) => setNewFolderName(e.target.value);
    const onCreateKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleCreation();
    };
    const onDoubleClick = () => setIsEditing(true);
    const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        // Ensuring that onDragEnter is triggered after the onDragLeave of potential children
        setTimeout(() => {
            setHighlightedFolderPath(fullPath);
        });
    };
    const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const related = e.relatedTarget as HTMLElement;
        if (folderRef.current && related && folderRef.current.contains(related)) {
            return;
        };

        setHighlightedFolderPath(null);
    };
    const onDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };
    const onDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        setHighlightedFolderPath(null);

        const data = e.dataTransfer.getData("application/json");
        if (!data) return;

        const { fileName } = JSON.parse(data);

        files.changeDirectory(fileName, fullPath);
    };
    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleRename();
    };

    if (node instanceof File) {
        return (
            <FileNode
                depth={depth}
                name={name}
                node={node}
                onFileClick={onFileClick}
                selectedFile={selectedFile}
            />
        );
    }

    return (
        <div
            onContextMenu={onContextMenu}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            ref={folderRef}
            style={{
                backgroundColor: isHighlighted
                    ? higlightedColor
                    : "transparent",
                display: "flex",
                flexDirection: "column",
                zIndex: depth + 1,
            }}
        >
            <div
                className="folders-explorer__item folder"
                onClick={onClick}
                onDoubleClick={onDoubleClick}
                style={{ paddingLeft: getPaddingLeft(depth) }}
            >
                {isOpen
                    ? <VscFolderOpened />
                    : <VscFolder />
                }
                {isEditing
                    ? (<InputStyleLess
                        autoFocus
                        name="folder-update-name"
                        onBlur={() => setIsEditing(false)}
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        value={updatedName}
                    />)
                    : (<p>{name}</p>)
                }

            </div>
            {isOpen && (
                <div className="nested-content">
                    {isCreating && (
                        <InputStyleLess
                            autoFocus
                            name="folder-create-name"
                            onBlur={() => setIsCreating(false)}
                            onChange={onCreateChange}
                            onKeyDown={onCreateKeyDown}
                            style={{ marginLeft: getPaddingLeft(depth + 1) }}
                            value={newFolderName}
                        />
                    )}
                    {Object.entries(node).sort().map(([childName, childNode]) => (
                        <TreeNode
                            depth={depth + 1}
                            highlightedFolderPath={highlightedFolderPath}
                            key={childName}
                            name={childName}
                            node={childNode}
                            onFileClick={onFileClick}
                            path={fullPath}
                            selectedFile={selectedFile}
                            setHighlightedFolderPath={setHighlightedFolderPath}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
