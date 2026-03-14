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

const getLockedPaths = (tree: FolderStructure, parentPath = ""): Record<string, boolean> => (
    Object.entries(tree).reduce<Record<string, boolean>>((acc, [name, node]) => {
        const currentPath = `${parentPath}/${name}`;

        if (isPdfMetadata(node)) {
            acc[currentPath] = !!node.lng;
            return (acc);
        }

        return ({
            ...acc,
            ...getLockedPaths(node, currentPath),
        });
    }, {})
);

type FilesLanguagesTreeProps = {
    readonly folder: FolderStructure;
    readonly onApply: (paths: Array<string>) => void;
    readonly selectedLanguage?: string;
};

const FilesLanguagesTree = ({
    folder,
    onApply,
    selectedLanguage,
}: FilesLanguagesTreeProps) => {
    const [selectedPaths, setSelectedPaths] = useState<Record<string, boolean>>({});

	const { setIsDefiningLng } = useFoldersManager();
    const { t } = useTranslation();

    const leafPaths = useMemo(() => getAllLeafPaths(folder), [folder]);
    const lockedPaths = useMemo(() => getLockedPaths(folder), [folder]);

    useEffect(() => {
		const synchronizePaths = (prev: Record<string, boolean>) => leafPaths.reduce<Record<string, boolean>>((acc, path) => {
            acc[path] = lockedPaths[path] 
				? true 
				: (prev[path] ?? false);

            return (acc);
        }, {});
        setSelectedPaths(synchronizePaths);
    }, [leafPaths, lockedPaths]);

    const selectablePaths = leafPaths.filter((path) => !lockedPaths[path]);

    const allChecked = (
        selectablePaths.length > 0 &&
        selectablePaths.every((path) => selectedPaths[path])
	);

    const someChecked = selectablePaths.some((path) => selectedPaths[path]);

    const toggleSelection = (path: string) => {
        if (lockedPaths[path]) return;

        setSelectedPaths((prev) => ({
            ...prev,
            [path]: !prev[path],
        }));
    };

    const handleToggleAll = (checked: boolean) => setSelectedPaths((prev) => {
        const next = { ...prev };

        selectablePaths.forEach((path) => {
            next[path] = checked;
        });

        return (next);
    });

    const selectedUnlockedPaths = selectablePaths.filter((path) => selectedPaths[path]);

    return (
        <div className="files-languages-tree">
            <div className="files-languages-nodes">
                {Object.entries(folder).sort().map(([name, node]) => (
                    <FilesLanguagesNode
                        depth={0}
                        key={name}
                        lockedPaths={lockedPaths}
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
                    disabled={selectablePaths.length === 0}
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
                    {t("actions.pass")}
                </Button>
                <Button
                    disabled={!selectedLanguage || selectedUnlockedPaths.length === 0}
                    onClick={() => onApply(selectedUnlockedPaths)}
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
        setIsDefiningLng,
        foldersStructure,
        folders,
    } = useFoldersManager();

    const { t } = useTranslation();
    const { currentWorkspace } = useWorkspaces();

    const [selectedLanguage, setSelectedLanguage] = useState<string>(currentWorkspace?.languages[0] ?? "");

    const folder = useMemo(() => {
        if (folderIndex === undefined) return (undefined);

        return (foldersStructure[folderIndex]);
    }, [folderIndex, foldersStructure]);

    const allFilesHaveLanguage = useMemo(() => {
        if (!folder) return (false);

        return (getAllLeafPaths(folder).every((path) => getLockedPaths(folder)[path]));
    }, [folder]);

    useEffect(() => {
        if (isDefiningLng && allFilesHaveLanguage) {
            setIsDefiningLng(false);
        }
    }, [allFilesHaveLanguage, isDefiningLng, setIsDefiningLng]);

	
    const handleApply = (paths: Array<string>) => {
		if (!selectedLanguage || paths.length === 0) return;
		
        folders.assignLanguageToFiles(paths, selectedLanguage);
    };

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
                    onApply={handleApply}
                    selectedLanguage={selectedLanguage}
                />
            </div>
        </Modal>
    );
};
