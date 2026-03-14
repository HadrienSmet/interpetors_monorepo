import { useMemo, useState } from "react";
import { MdDownload, MdHorizontalRule } from "react-icons/md";
import { useTranslation } from "react-i18next";

import { useColorPanel } from "@/modules/colorPanel";
import { ResizableSection } from "@/modules/resizableLayout";

import { useFoldersManager } from "../../contexts";
import { downloadFolderAsZip } from "../../utils";

import { TreeNode } from "./nodes";
import "./foldersExplorer.scss";

const BUTTON_SIZE = 14 as const;
const INITIAL_WIDTH = 200 as const;

export const FoldersExplorer = () => {
    const [collapseSignal, setCollapseSignal] = useState(0);
    const [highlightedFolderPath, setHighlightedFolderPath] = useState<string | null>(null);

    const { colorPanel } = useColorPanel();
    const { foldersStructure } = useFoldersManager();
    const { t } = useTranslation();

    const foldersTree = useMemo(() => (
        foldersStructure.map((structure, idx) => (
            Object.entries(structure).sort().map(([name, node]) => (
                <TreeNode
                    collapseSignal={collapseSignal}
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
    ), [collapseSignal, foldersStructure, highlightedFolderPath]);

    const buttons = [
        {
            icon: <MdDownload size={BUTTON_SIZE} />,
            onClick: () => downloadFolderAsZip(foldersStructure, colorPanel),
            title: t("folders.download", { count: foldersStructure.length }),
        },
        {
            icon: <MdHorizontalRule size={BUTTON_SIZE} />,
            onClick: () => setCollapseSignal(state => state + 1),
            title: t("folders.close", { count: foldersStructure.length }),
        },
    ];

    return (
        <ResizableSection
            initialWidth={INITIAL_WIDTH}
            id="folders-explorer"
        >
            <div className="folders-explorer__header">
                {buttons.map((btn, index) => (
                    <button
						{...btn}
                        key={`explorer-btn-${index}`}
                    >
                        {btn.icon}
                    </button>
                ))}
            </div>
            {foldersTree}
        </ResizableSection>
    );
};
