import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { FolderStructure } from "@repo/types";

import { Button, LanguageSelect, Modal } from "@/components";
import { useWorkspaces } from "@/modules/workspace";

import { isPdfMetadata, useFoldersManager } from "../../contexts";

import { FilesLanguagesNode } from "./FilesLanguagesNode";
import "./filesLanguagesTree.scss";

const getAllLeafPaths = (tree: FolderStructure, parentPath = ""): Array<string> => (
    Object.entries(tree).flatMap(([name, node]) => {
        const currentPath = `${parentPath}/${name}`;

        if (isPdfMetadata(node)) {
            return ([currentPath]);
        }

        return (getAllLeafPaths(node, currentPath));
    })
);

type FilesLanguagesTreeProps = {
    readonly folder: FolderStructure;
    readonly selectedLanguage?: string;
};

const FilesLanguagesTree = ({
    folder,
    selectedLanguage,
}: FilesLanguagesTreeProps) => {
    const [selectedPaths, setSelectedPaths] = useState<Record<string, boolean>>({});

	const { folders, setIsDefiningLng } = useFoldersManager();
    const { t } = useTranslation();

    const leafPaths = useMemo(() => getAllLeafPaths(folder), [folder]);

	useEffect(() => {
		setSelectedPaths((prev) => (
			leafPaths.reduce<Record<string, boolean>>((acc, path) => {
				acc[path] = prev[path] ?? false;

				return (acc);
			}, {})
		));
	}, [leafPaths]);

    const allChecked = (
        leafPaths.length > 0 &&
        leafPaths.every((path) => selectedPaths[path])
	);

    const someChecked = leafPaths.some((path) => selectedPaths[path]);
	const selectedUnlockedPaths = leafPaths.filter((path) => selectedPaths[path]);

    const toggleSelection = (path: string) => {
        setSelectedPaths((prev) => ({
            ...prev,
            [path]: !prev[path],
        }));
    };

	const handleApply = () => {
		if (!selectedLanguage || selectedUnlockedPaths.length === 0) return;
		
        folders.assignLanguageToFiles(selectedUnlockedPaths, selectedLanguage);

		setSelectedPaths((prev) => (
			Object.keys(prev).reduce<Record<string, boolean>>((acc, path) => {
				acc[path] = false;

				return (acc);
			}, {})
		));
    };
    const handleToggleAll = (checked: boolean) => setSelectedPaths((prev) => {
        const next = { ...prev };

        leafPaths.forEach((path) => {
            next[path] = checked;
        });

        return (next);
    });


    return (
        <div className="files-languages-tree">
            <div className="files-languages-nodes">
                {Object.entries(folder).sort().map(([name, node]) => (
                    <FilesLanguagesNode
                        depth={0}
                        key={name}
                        name={name}
                        node={node}
                        path=""
                        selectedPaths={selectedPaths}
                        toggleSelection={toggleSelection}
                    />
                ))}
            </div>

            <div className="global-select">
                <input
                    checked={allChecked}
                    disabled={leafPaths.length === 0}
                    id="all"
                    onChange={(e) => handleToggleAll(e.target.checked)}
                    ref={(el) => {
                        if (el) {
                            el.indeterminate = !allChecked && someChecked;
                        }
                    }}
                    type="checkbox"
                />
                <label htmlFor="all">
					{t("all")}
				</label>
            </div>

            <div className="files-languages-tree__buttons">
				<Button onClick={() => setIsDefiningLng(false)}>
                    {t("actions.close")}
                </Button>
                <Button
                    disabled={!selectedLanguage || selectedUnlockedPaths.length === 0}
                    onClick={handleApply}
                >
                    {t("actions.apply")}
                </Button>
            </div>
        </div>
    );
};

type FilesLanguagesTreeModalProps = {
    readonly folderIndex?: number;
};
export const FilesLanguagesTreeModal = ({ folderIndex }: FilesLanguagesTreeModalProps) => {
    const {
        isDefiningLng,
        foldersStructure,
    } = useFoldersManager();

    const { t } = useTranslation();
    const { currentWorkspace } = useWorkspaces();

    const [selectedLanguage, setSelectedLanguage] = useState<string>(currentWorkspace?.languages[0] ?? "");

    const folder = useMemo(() => {
        if (folderIndex === undefined) return (undefined);

        return (foldersStructure[folderIndex]);
    }, [folderIndex, foldersStructure]);

	if (!folder) {
		return (null);
	}

    return (
        <Modal
            isOpen={isDefiningLng}
            onClose={() => null}
            persistant
            width="40%"
        >
            <div className="files-languages-tree__modal">
                <h3>{t("folders.languagesTree.title")}</h3>

                <LanguageSelect
                    name="files-languages-tree__select"
                    onChange={(lng) => setSelectedLanguage(lng)}
                    recommandedItems={currentWorkspace?.languages}
                />

                <FilesLanguagesTree
                    folder={folder}
                    selectedLanguage={selectedLanguage}
                />
            </div>
        </Modal>
    );
};
