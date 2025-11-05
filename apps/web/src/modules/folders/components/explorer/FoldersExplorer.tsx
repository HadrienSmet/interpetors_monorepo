import { Dispatch, useMemo, useState } from "react";

import { FolderStructure } from "@repo/types";

import { ResizableSection } from "@/modules/resizableLayout";

import { FileData } from "../../types";

import { TreeNode } from "./nodes";
import "./foldersExplorer.scss";

const INITIAL_WIDTH = 200 as const;

type FoldersExplorerCommonProps = {
    readonly foldersStructure: Array<FolderStructure>;
    readonly selectedFile: FileData;
    readonly setSelectedFile: Dispatch<FileData>;
};

export const FoldersExplorer = (props: FoldersExplorerCommonProps) => {
    const [highlightedFolderPath, setHighlightedFolderPath] = useState<string | null>(null);

    const { foldersStructure, ...rest } = props;

    const foldersTree = useMemo(() => (
        foldersStructure.map((structure, idx) => (
            Object.entries(structure).sort().map(([name, node]) => (
                <TreeNode
                    {...rest}
                    depth={0}
                    highlightedFolderPath={highlightedFolderPath}
                    key={`${idx}-${name}`}
                    name={name}
                    node={node}
                    path=""
                    setHighlightedFolderPath={setHighlightedFolderPath}
                />
            ))
        ))
    ), [foldersStructure, highlightedFolderPath]);

    return (
        <ResizableSection
            initialWidth={INITIAL_WIDTH}
            id="folders-explorer"
        >
            {foldersTree}
        </ResizableSection>
    );
};
