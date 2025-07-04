import { useMemo, useState } from "react";

import { ResizableSection } from "@/components";

import { useFoldersManager } from "../../contexts";

import { FILE_DISPLAYER_MIN_WIDTH } from "../files";

import { TreeNode } from "./nodes";
import "./foldersExplorer.scss";

const INITIAL_WIDTH = 200 as const;

export const FoldersExplorer = () => {
    const [highlightedFolderPath, setHighlightedFolderPath] = useState<string | null>(null);

    const { foldersStructures } = useFoldersManager();

    // Prevent from weird behavior when the rest of the app has no more space
    const getMaxWidth = () => {
        // very bad to do that
        const folderDisplayer = document.querySelector(".folders-displayer") as HTMLElement;
        const totalWidth = folderDisplayer?.offsetWidth || 0;

        return (Math.max(0, totalWidth - (FILE_DISPLAYER_MIN_WIDTH)));
    };

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
            getMaxWidth={getMaxWidth}
        >
            {foldersTree}
        </ResizableSection>
    );
};
