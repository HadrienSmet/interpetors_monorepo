import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdClose } from "react-icons/md";

import { FolderStructure } from "@repo/types";

import { Button, LanguageSelect, Modal } from "@/components";
import { useWorkspaces } from "@/modules/workspace";

import { isPdfMetadata, LANGUAGES_STATE, useFoldersManager } from "../../contexts";

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

type SelectedPaths = Record<string, boolean>;
type FilesLanguagesTreeProps = {
    readonly folder: FolderStructure;
    readonly selectedLanguage?: string;
};

const FilesLanguagesTree = ({
    folder,
    selectedLanguage,
}: FilesLanguagesTreeProps) => {
    const [selectedPaths, setSelectedPaths] = useState<SelectedPaths>({});

	const { folders, languagesState, selectedFile, setLanguagesState } = useFoldersManager();
    const { t } = useTranslation();

    const leafPaths = useMemo(() => getAllLeafPaths(folder), [folder]);

	const targetedFilePath = selectedFile.path;
    const targetedFileHasLanguage = !!selectedFile.fileInStructure?.language;
    const isMandatory = languagesState === LANGUAGES_STATE.MANDATORY;

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
			Object.keys(prev).reduce<SelectedPaths>((acc, path) => {
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

	// Responsible to set the default value
    useEffect(() => {
        setSelectedPaths((prev) => {
            const next = leafPaths.reduce<SelectedPaths>((acc, path) => {
				const target = targetedFilePath[0] === "/"
					? targetedFilePath
					: `/${targetedFilePath}`;

				if (isMandatory && target === path) {
					acc[path] = true;
				} else {
					acc[path] = prev[path] ?? false;
				}

                return (acc);
            }, {});

            return (next);
        });
    }, [leafPaths, isMandatory, targetedFilePath]);
	// Responsible to close the modal when a language has been defined for the targeted file
    useEffect(() => {
        if (isMandatory && targetedFileHasLanguage) {
            setLanguagesState(LANGUAGES_STATE.NULL);
        }
    }, [isMandatory, targetedFileHasLanguage, setLanguagesState]);

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
				{languagesState === LANGUAGES_STATE.MANDATORY && (
					<Button
						disabled={!targetedFileHasLanguage}
						onClick={() => setLanguagesState(LANGUAGES_STATE.NULL)}
					>
						{t("actions.close")}
					</Button>
				)}
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
        languagesState,
        foldersStructure,
		selectedFile,
		setLanguagesState,
    } = useFoldersManager();
    const { t } = useTranslation();
    const { currentWorkspace } = useWorkspaces();

    const [selectedLanguage, setSelectedLanguage] = useState<string>(currentWorkspace?.languages[0] ?? "");

    const folder = useMemo(() => {
        if (folderIndex === undefined) return (undefined);

        return (foldersStructure[folderIndex]);
    }, [folderIndex, foldersStructure]);
	const targetedFileName = selectedFile.fileInStructure?.name;

	if (!folder) {
		return (null);
	}

    return (
        <Modal
            isOpen={(languagesState !== LANGUAGES_STATE.NULL)}
            onClose={() => null}
            persistant
            width="40%"
        >
            <div className="files-languages-tree__modal">
				<div className="files-languages-tree__header">
					<h3>
						{t(`folders.languagesTree.${languagesState}`, { targetedFileName })}
					</h3>
					{languagesState === LANGUAGES_STATE.OPTIONAL && (
						<button onClick={() => setLanguagesState(LANGUAGES_STATE.NULL)}>
							<MdClose />
						</button>
					)}
				</div>

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
