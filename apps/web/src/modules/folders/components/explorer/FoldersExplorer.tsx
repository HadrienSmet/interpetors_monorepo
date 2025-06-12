import { useMemo, useState } from "react";

import { ResizableSection } from "@/components";
import { FileInStructure, FolderStructure } from "../../contexts";

import { FILE_DISPLAYER_MIN_WIDTH } from "../files";

import { TreeNode } from "./nodes";
import "./foldersExplorer.scss";


const INITIAL_WIDTH = 200 as const;
type FoldersExplorerProps = {
    readonly foldersStructures: Array<FolderStructure>;
    readonly handleFileClick: (file: FileInStructure, path: string) => void;
    readonly selectedFile: FileInStructure | null;
};
export const FoldersExplorer = ({ foldersStructures, handleFileClick, selectedFile }: FoldersExplorerProps) => {
    const [highlightedFolderPath, setHighlightedFolderPath] = useState<string | null>(null);

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
                    onFileClick={handleFileClick}
                    path=""
                    selectedFile={selectedFile?.file ?? null}
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
