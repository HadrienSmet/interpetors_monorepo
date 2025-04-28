import { ChangeEvent, KeyboardEvent, useState } from "react";
import { VscFolder, VscFolderOpened } from "react-icons/vsc";

import { FolderStructure, useFoldersManager } from "@/contexts";

import { FILE_DISPLAYER_MIN_WIDTH, FileIcon } from "../../files";
import { InputStyleLess, ResizableSection } from "../../ui";

import "./foldersExplorer.scss";

const getPaddingLeft = (depth: number) => ((depth * 16) + 4);

type TreeNodeProps = {
    readonly depth: number;
    readonly name: string;
    readonly node: FolderStructure | File;
    readonly onFileClick: (file: File) => void;
    readonly selectedFile: File | null;
};
type FileNodeProps =
    & Omit<TreeNodeProps, "node">
    & { readonly node: File; };
const FileNode = ({ depth, name, node, onFileClick, selectedFile }: FileNodeProps) => {
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
    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleRename();
    };

    return (
        <div
            className={`folders-explorer__item ${(selectedFile && node.name === selectedFile.name) ? "selected" : ""}`}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            style={{ paddingLeft: getPaddingLeft(depth) }}
        >
            {isEditingFile
                ? (
                    <InputStyleLess
                        autoFocus
                        name="file-name-input"
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        value={newFileName}
                    />
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
const TreeNode = ({ depth, name, node, onFileClick, selectedFile }: TreeNodeProps) => {
    const [isOpen, setIsOpen] = useState(depth === 0);

    const onClick = () => setIsOpen(!isOpen);

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
        <>
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
                            key={childName}
                            name={childName}
                            node={childNode}
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
    const getMaxWidth = () => {
        // very bad to do that
        const folderDisplayer = document.querySelector(".folders-displayer") as HTMLElement;
        const totalWidth = folderDisplayer?.offsetWidth || 0;

        return (Math.max(0, totalWidth - (FILE_DISPLAYER_MIN_WIDTH)));
    };

    return (
        <ResizableSection
            initialWidth={INITIAL_WIDTH}
            getMaxWidth={getMaxWidth}
        >
            {foldersStructures.map((structure, idx) =>
                Object.entries(structure).map(([name, node]) => (
                    <TreeNode
                        depth={0}
                        key={`${idx}-${name}`}
                        name={name}
                        node={node}
                        onFileClick={handleFileClick}
                        selectedFile={selectedFile}
                    />
                ))
            )}
        </ResizableSection>
    );
};
