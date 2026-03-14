import { useMemo } from "react";

import { FolderStructure, PdfMetadata } from "@repo/types";

import { isPdfMetadata } from "../../contexts";

import "./filesLanguagesNode.scss";

export const getPaddingLeft = (depth: number) => (depth * 16) + 4;

type FilesLanguagesNodeProps = {
    readonly depth: number;
    readonly name: string;
    readonly node: FolderStructure | PdfMetadata;
    readonly path: string;
    readonly selectedPaths: Record<string, boolean>;
    readonly toggleSelection: (path: string) => void;
};

export const FilesLanguagesNode = ({
    depth,
    name,
    node,
    path,
    selectedPaths,
    toggleSelection,
}: FilesLanguagesNodeProps) => {
    const fullPath = useMemo(() => `${path}/${name}`, [name, path]);

    if (isPdfMetadata(node)) {
        return (
            <div
                className="files-languages__leaf"
                style={{ marginLeft: getPaddingLeft(depth) }}
            >
                <input
                    checked={selectedPaths[fullPath]}
                    id={fullPath}
                    onChange={() => toggleSelection(fullPath)}
                    type="checkbox"
                />
                <label htmlFor={fullPath}>
                    {name} {node.lng ? ` - (${node.lng})` : ""}
                </label>
            </div>
        );
    }

    return (
        <div
            className="files-languages__node"
            style={{ marginLeft: getPaddingLeft(depth) }}
        >
            <p>{name}</p>
            {Object.entries(node).sort().map(([childName, childNode]) => (
                <FilesLanguagesNode
					depth={depth + 1}
					key={childName}
                    name={childName}
                    node={childNode}
                    path={fullPath}
                    selectedPaths={selectedPaths}
                    toggleSelection={toggleSelection}
                />
            ))}
        </div>
    );
};
