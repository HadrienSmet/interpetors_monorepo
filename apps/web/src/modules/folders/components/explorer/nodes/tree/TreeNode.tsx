import { useMemo, useState } from "react";
import { VscFolder, VscFolderOpened } from "react-icons/vsc";

import { useCssVariable } from "@/hooks";

import { isPdfFile } from "../../../../contexts";

import { FileNode } from "../file";
import { TreeNodeProps } from "../nodes.types";
import { getPaddingLeft } from "../nodes.utils";

export type UneditableTreeNodeProps =
    & TreeNodeProps
    & {
        readonly highlightedFolderPath: string | null;
        readonly setHighlightedFolderPath: (path: string | null) => void;
    };

export const TreeNode = (props: UneditableTreeNodeProps) => {
    const {
        depth,
        highlightedFolderPath,
        name,
        node,
        path,
    } = props;
    const [isOpen, setIsOpen] = useState(depth === 0);

    const higlightedColor = useCssVariable("--clr-txt-02");

    const fullPath = useMemo(
        () => (path ? `${path}/${name}` : name),
        [path, name]
    );
    const isHighlighted = useMemo(
        () => (highlightedFolderPath === fullPath),
        [name, path, highlightedFolderPath]
    );

    // ----- Events ------
    const onClick = () => setIsOpen(state => !state);

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
