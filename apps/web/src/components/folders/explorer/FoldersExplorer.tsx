import { useState } from "react";
import { VscFolder, VscFolderOpened } from "react-icons/vsc";

import { FileIcon } from "../../files";
import { ResizableSection } from "../../ui";

import { FolderStructure } from "../folders.types";

import "./foldersExplorer.scss";

type TreeNodeProps = {
    readonly depth: number;
    readonly name: string;
    readonly node: FolderStructure | File;
    readonly onFileClick: (file: File) => void;
    readonly path: string;
    readonly selectedFile: File | null;
};
const TreeNode = ({ depth, name, node, onFileClick, path, selectedFile }: TreeNodeProps) => {
    const [isOpen, setIsOpen] = useState(true);

    const fullPath = path
        ? `${path}/${name}`
        : name;

    if (node instanceof File) {
        return (
            <div
                className={`folders-explorer__item ${(selectedFile && node.name === selectedFile.name) ? "selected" : ""}`}
                onClick={() => onFileClick(node)}
                style={{ paddingLeft: (depth * 16) + 4 }}
            >
                <FileIcon node={node} />
                <p>{name}</p>
            </div>
        );
    }

    return (
        <>
            <div
                className="folders-explorer__item folder"
                onClick={() => setIsOpen(!isOpen)}
                style={{ paddingLeft: (depth * 16) + 4 }}
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
                            key={childName}
                            name={childName}
                            node={childNode}
                            path={fullPath}
                            onFileClick={onFileClick}
                            selectedFile={selectedFile}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

const INITIAL_WIDTH = 200 as const;
type FoldersExplorerProps = {
    readonly foldersStructures: Array<FolderStructure>;
    readonly handleFileClick: (file: File) => void;
    readonly selectedFile: File | null;
};
export const FoldersExplorer = ({ foldersStructures, handleFileClick, selectedFile }: FoldersExplorerProps) => {
    return (
        <ResizableSection initialWidth={INITIAL_WIDTH}>
            {foldersStructures.map((structure, idx) =>
                Object.entries(structure).map(([name, node]) => (
                    <TreeNode
                        depth={0}
                        key={`${idx}-${name}`}
                        name={name}
                        node={node}
                        path=""
                        onFileClick={handleFileClick}
                        selectedFile={selectedFile}
                    />
                ))
            )}
        </ResizableSection>
    );
};
