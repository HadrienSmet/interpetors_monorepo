import { ChangeEvent, DragEvent, KeyboardEvent, MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { MdCreateNewFolder, MdDelete, MdDriveFileRenameOutline } from "react-icons/md";
import { VscFolder, VscFolderOpened } from "react-icons/vsc";
import { useTranslation } from "react-i18next";

import { InputStyleLess } from "@/components";
import { useContextMenu } from "@/contexts";
import { useCssVariable } from "@/hooks";

import { isPdfFile, useFoldersManager } from "../../../../contexts";

import { handleDynamicEvent, FileNode } from "../file";
import { getPaddingLeft } from "../nodes.utils";
import { TreeNodeProps } from "../nodes.types";

const isSubPath = (originPath: string, targetPath: string): boolean => (
    targetPath === originPath || targetPath.startsWith(`${originPath}/`)
);

type CurrentTreeNodeProps =
    & TreeNodeProps
    & {
        readonly collapseSignal: number;
        readonly highlightedFolderPath: string | null;
        readonly setHighlightedFolderPath: (path: string | null) => void;
    };
export const TreeNode = (props: CurrentTreeNodeProps) => {
    const {
        collapseSignal,
        depth,
        highlightedFolderPath,
        name,
        node,
        path,
        setHighlightedFolderPath,
    } = props;

    /** Indicates if user is creating a folder inside the TreeNode */
    const [isCreating, setIsCreating] = useState(false);
    /** Indicates if user is renaming the TreeNode */
    const [isRenaming, setIsRenaming] = useState(false);
    const [isOpen, setIsOpen] = useState(depth === 0);
    /** Name of the sub folder that is being created */
    const [newFolderName, setNewFolderName] = useState("");
    /** Name of the folder while getting renamed */
    const [updatedName, setUpdatedName] = useState(name);

    const folderRef = useRef<HTMLDivElement | null>(null);

    const { setContextMenu } = useContextMenu();
    const higlightedColor = useCssVariable("--clr-txt-02");
    const { files, folders, isEditable } = useFoldersManager();
    const { t } = useTranslation();

    const fullPath = useMemo(() => (
        path ? `${path}/${name}` : name
    ), [path, name]);
    const isHighlighted = useMemo(() => (
        highlightedFolderPath === fullPath
    ),[name, path, highlightedFolderPath]);

    const handleCreation = () => {
        const trimmed = newFolderName
            .trim()
            .split("")
            .filter(el => el !== "/")
            .join("");

        if (trimmed) {
            folders.create(trimmed, fullPath);
        }

        setNewFolderName("");
        setIsCreating(false);
    };
    const handleRename = () => {
        const trimmed = updatedName.trim();

        if (trimmed && trimmed !== node.name) {
            folders.rename(fullPath, trimmed);
        }

        setIsRenaming(false);
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
                    <p>{t("folders.context-menu.create")}</p>
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
                    <p>{t("folders.context-menu.rename")}</p>
                </>
            ),
            onClick: () => contextMenuItemClick(() => setIsRenaming(true)),
        },
        {
            children: (
                <>
                    <MdDelete />
                    <p>{t("folders.context-menu.delete")}</p>
                </>
            ),
            onClick: () => contextMenuItemClick(() => folders.delete(fullPath)),
        },
    ];

    // ----- Events ------
    const onChange = (e: ChangeEvent<HTMLInputElement>) => setUpdatedName(e.target.value);
    const onClick = () => setIsOpen(state => !state);
    const onContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setHighlightedFolderPath(fullPath);
        setContextMenu({ x: e.clientX, y: e.clientY }, contextMenuItems, () => setHighlightedFolderPath(null));
    };
    const onCreateChange = (e: ChangeEvent<HTMLInputElement>) => setNewFolderName(e.target.value);
    const onCreateKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleCreation();
    };
    const onDoubleClick = () => setIsRenaming(true);
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
    const onDragStart = (e: DragEvent<HTMLDivElement>) => {
        e.stopPropagation();

        e.dataTransfer.setData("application/folder-path", fullPath);
        e.dataTransfer.effectAllowed = "move";
    };
    const onDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        setHighlightedFolderPath(null);

        const fileData = e.dataTransfer.getData("application/json");
        if (fileData) {
            const { fileName } = JSON.parse(fileData);

            files.changeDirectory(fileName, fullPath);
        }

        const originPath = e.dataTransfer.getData("application/folder-path");
        if (!originPath) {
            return;
        };

        if (isSubPath(originPath, fullPath)) {
            return;
        }

        folders.changeDirectory(originPath, fullPath);
    };
    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleRename();
    };
    const handleEditableEvent = (fn: () => void) => handleDynamicEvent(isEditable, fn);

    useEffect(() => {
        setIsOpen(false);
    }, [collapseSignal]);

    if (isPdfFile(node)) {
        return (
            <FileNode
                {...props}
                node={node}
                path={fullPath}
            />
        );
    }

    return (
        <div
            draggable
            onContextMenu={(e) => handleEditableEvent(() => onContextMenu(e))}
            onDragEnter={(e) => handleEditableEvent(() => onDragEnter(e))}
            onDragLeave={(e) => handleEditableEvent(() => onDragLeave(e))}
            onDragOver={(e) => handleEditableEvent(() => onDragOver(e))}
            onDragStart={(e) => handleEditableEvent(() => onDragStart(e))}
            onDrop={(e) => handleEditableEvent(() => onDrop(e))}
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
                onDoubleClick={() => handleEditableEvent(() => onDoubleClick())}
                style={{ paddingLeft: getPaddingLeft(depth) }}
            >
                {isOpen
                    ? <VscFolderOpened />
                    : <VscFolder />
                }
                {(isEditable && isRenaming)
                    ? (
                        <InputStyleLess
                            autoFocus
                            name="folder-update-name"
                            onBlur={() => setIsRenaming(false)}
                            onChange={onChange}
                            onKeyDown={onKeyDown}
                            value={updatedName}
                        />
                    )
                    : (<p>{name}</p>)
                }

            </div>
            {isOpen && (
                <div className="nested-content">
                    {(isCreating && isEditable) && (
                        <div
                            className="folders-explorer__item folder"
                            style={{ marginLeft: getPaddingLeft(depth + 1) }}
                        >
                            <VscFolder />
                            <InputStyleLess
                                autoFocus
                                name="folder-create-name"
                                onBlur={() => setIsCreating(false)}
                                onChange={onCreateChange}
                                onKeyDown={onCreateKeyDown}
                                value={newFolderName}
                            />
                        </div>
                    )}
                    {Object.entries(node).sort().map(([childName, childNode]) => (
                        <TreeNode
                            {...props}
                            depth={depth + 1}
                            key={childName}
                            name={childName}
                            node={childNode}
                            path={fullPath}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
