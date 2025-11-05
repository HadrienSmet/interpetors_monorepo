import { useMemo, useState } from "react";

import { ResizableSection } from "@/modules/resizableLayout";

import { useFoldersManager } from "../../contexts";

import { NewTreeNode } from "./nodes";
import "./foldersExplorer.scss";

const INITIAL_WIDTH = 200 as const;

export const NewFoldersExplorer = () => {
    const [highlightedFolderPath, setHighlightedFolderPath] = useState<string | null>(null);

    const { foldersStructure } = useFoldersManager();

    const foldersTree = useMemo(() => (
        foldersStructure.map((structure, idx) => (
            Object.entries(structure).sort().map(([name, node]) => (
                <NewTreeNode
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
