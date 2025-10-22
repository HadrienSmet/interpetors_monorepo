import { ChangeEvent, useState } from "react";
import { MdDownload, MdSave } from "react-icons/md";
import { useTranslation } from "react-i18next";

import { InputStyleLess } from "@/components";
import { useCssVariable } from "@/hooks";
import {
    downloadFolderAsZip,
    downloadVocabulary,
    PREPARATION,
    uploadPreparation,
    useColorPanel,
    useFoldersManager,
    useVocabularyTable,
    useWorkspaces,
} from "@/modules";

import "./manager.scss";

export const PreparationManager = () => {
    const [title, setTitle] = useState("");

    const { colorPanel } = useColorPanel();
    const inputSize = useCssVariable("--size-xl");
    const { foldersStructure: folders } = useFoldersManager();
    const { t } = useTranslation();
    const { list: vocabularyTerms } = useVocabularyTable();
    const { currentWorkspace } = useWorkspaces();

    const { languages, nativeLanguage } = currentWorkspace!;

    const headerToUse = [
        t("vocabulary.sources"),
        nativeLanguage,
        ...languages.filter(lng => lng !== nativeLanguage)
    ];

    const handleDownloadVoc = () => downloadVocabulary(vocabularyTerms, headerToUse, colorPanel);
    const handleDownloadFolders = () => downloadFolderAsZip(folders, colorPanel);
    const onChange = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);

    const handleSave = async () => {
        const workspaceId = currentWorkspace!.id;
        const prepRes = await PREPARATION.create({
            body: { title },
            workspaceId,
        });

        if (!prepRes.success) {
            throw new Error("An error occured while creating preparation");
        }

        await uploadPreparation({
            folders,
            preparationId: prepRes.data.id,
            rootFolderId: "root",
            vocabularyTerms,
            workspaceId,
        });
    };

    return (
        <div className="preparation-manager">
            <div className="preparation-title">
                <InputStyleLess
                    onChange={onChange}
                    placeholder={t("views.new.title")}
                    style={{
                        fontSize: inputSize,
                        fontWeight: 600,
                        width: "100%",
                    }}
                    value={title}
                />
            </div>
            <div className="preparation-buttons">
                <button
                    disabled={folders.length === 0}
                    onClick={handleDownloadFolders}
                    title={folders.length === 0
                        ? t("folders.empty")
                        : t("folders.download")}
                >
                    <MdDownload />
                    <span>{t("views.new.buttons.downloadFiles")}</span>
                </button>
                <button
                    disabled={vocabularyTerms.length === 0}
                    onClick={handleDownloadVoc}
                    title={vocabularyTerms.length === 0
                        ? t("vocabulary.empty")
                        : t("views.new.buttons.downloadVocabulary")
                    }
                >
                    <MdDownload />
                    <span>{t("views.new.buttons.downloadVocabulary")}</span>
                </button>
                <button
                    disabled={(
                        title === "" ||
                        folders.length === 0
                    )}
                    onClick={handleSave}
                    title={t("onConstruction")}
                >
                    <MdSave />
                    <span>{t("views.new.buttons.save")}</span>
                </button>
            </div>
        </div>
    );
};
