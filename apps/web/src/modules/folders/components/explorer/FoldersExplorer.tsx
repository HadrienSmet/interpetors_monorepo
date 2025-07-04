import { useMemo, useState } from "react";

import { ResizableSection } from "@/modules/resizableLayout";

import { useFoldersManager } from "../../contexts";

import { TreeNode } from "./nodes";
import "./foldersExplorer.scss";

const INITIAL_WIDTH = 200 as const;

export const FoldersExplorer = () => {
    const [highlightedFolderPath, setHighlightedFolderPath] = useState<string | null>(null);

    const { foldersStructures } = useFoldersManager();

    const foldersTree = useMemo(() => (
        foldersStructures.map((structure, idx) =>
            Object.entries(structure).sort().map(([name, node]) => (
                <TreeNode
                    depth={0}
                    highlightedFolderPath={highlightedFolderPath}
                    key={`${idx}-${name}`}
                    name={name}
                    node={node}
                    path=""
                    setHighlightedFolderPath={setHighlightedFolderPath}
                />
            ))
        )
    ), [foldersStructures, highlightedFolderPath]);

    return (
        <ResizableSection
            initialWidth={INITIAL_WIDTH}
            id={"folders-explorer"}
        >
            {foldersTree}
        </ResizableSection>
    );
};
