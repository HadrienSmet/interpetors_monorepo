import { useMemo, useState } from "react";
import { PiDownloadSimple, PiMinus, PiTranslate } from "react-icons/pi";
import { useTranslation } from "react-i18next";

import { useColorPanel } from "@/modules/colorPanel";
import { ResizableSection } from "@/modules/resizableLayout";

import { LANGUAGES_STATE, useFoldersManager } from "../../contexts";
import { downloadFolderAsZip } from "../../utils";

import { TreeNode } from "./nodes";
import "./foldersExplorer.scss";

const BUTTON_SIZE = 16 as const;
const INITIAL_WIDTH = 200 as const;

export const FoldersExplorer = () => {
    const [collapseSignal, setCollapseSignal] = useState(0);
    const [highlightedFolderPath, setHighlightedFolderPath] = useState<string | null>(null);

    const { colorPanel } = useColorPanel();
    const { foldersStructure, setLanguagesState } = useFoldersManager();
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

	const isDisabled = foldersStructure.length === 0;

    const buttons = [
        {
            icon: <PiTranslate size={BUTTON_SIZE} />,
			isDisabled,
            onClick: () => setLanguagesState(LANGUAGES_STATE.OPTIONAL),
            title: t("folders.languages.tree.access"),
        },
        {
            icon: <PiDownloadSimple size={BUTTON_SIZE} />,
			isDisabled,
            onClick: () => downloadFolderAsZip(foldersStructure, colorPanel),
            title: t("folders.download", { count: foldersStructure.length }),
        },
        {
            icon: <PiMinus size={BUTTON_SIZE} />,
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
                {buttons.map(({ isDisabled, ...btn }, index) => (
                    <button
						{...btn}
						disabled={isDisabled ?? false}
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
