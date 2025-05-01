import { DragEvent, useMemo, useRef, useState } from "react";
import { VscFolder, VscFolderOpened } from "react-icons/vsc";

import { useFoldersManager } from "@/contexts";
import { useCssVariable } from "@/hooks";

import { FileNode } from "./FileNode";
import { TreeNodeProps } from "./nodes.types";
import { getPaddingLeft } from "./nodes.utils";

export const TreeNode = ({ depth, highlightedFolderPath, name, node, onFileClick, path, selectedFile, setHighlightedFolderPath }: TreeNodeProps & { highlightedFolderPath: string | null; readonly setHighlightedFolderPath: (path: string | null) => void;
}) => {
    const [isOpen, setIsOpen] = useState(depth === 0);
    const folderRef = useRef<HTMLDivElement | null>(null);

    const { files } = useFoldersManager();
    const higlightedColor = useCssVariable("--clr-txt-02");

    const fullPath = useMemo(
        () => (path ? `${path}/${name}` : name),
        [path, name]
    );
    const isHighlighted = useMemo(
        () => (highlightedFolderPath === fullPath),
        [name, path, highlightedFolderPath]
    );

    const onClick = () => setIsOpen(!isOpen);
    const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        // Ensuring that onDragEnter is triggered after the onDragLeave of potential children
        setTimeout(() => {
            setHighlightedFolderPath(fullPath)
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
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            ref={folderRef}
            style={{
                display: "flex",
                flexDirection: "column",
                zIndex: depth + 1,
                backgroundColor: isHighlighted
                    ? higlightedColor
                    : "transparent",
            }}
        >
            <div
                className="folders-explorer__item folder"
                onClick={onClick}
                style={{ paddingLeft: getPaddingLeft(depth) }}
            >
                {isOpen
                    ? <VscFolderOpened />
                    : <VscFolder />
                }
                <p>{name}</p>
            </div>
            {isOpen && (
                <div className="nested-content">
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
