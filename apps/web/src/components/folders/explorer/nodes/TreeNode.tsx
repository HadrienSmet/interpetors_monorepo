import { DragEvent, useState } from "react";
import { VscFolder, VscFolderOpened } from "react-icons/vsc";

import { useFoldersManager } from "@/contexts";

import { FileNode } from "./FileNode";
import { TreeNodeProps } from "./nodes.types";
import { getPaddingLeft } from "./nodes.utils";

export const TreeNode = ({ depth, highlightedFolderPath, name, node, onFileClick, path, selectedFile, setHighlightedFolderPath }: TreeNodeProps & { highlightedFolderPath: string | null; readonly setHighlightedFolderPath: (path: string | null) => void;
}) => {
    const [isOpen, setIsOpen] = useState(depth === 0);

    const { files } = useFoldersManager();

    const fullPath = path
        ? `${path}/${name}`
        : name;
    const isHighlighted = highlightedFolderPath === fullPath;

    const onClick = () => setIsOpen(!isOpen);
    const onDragEnter = () => setHighlightedFolderPath(fullPath);
    const onDragLeave = () => setHighlightedFolderPath(null);
    const onDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };
    const onDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

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
            style={{
                display: "flex",
                flexDirection: "column",
                zIndex: depth + 1,
                backgroundColor: isHighlighted ? "red" : "transparent",
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
                    {Object.entries(node).map(([childName, childNode]) => (
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
