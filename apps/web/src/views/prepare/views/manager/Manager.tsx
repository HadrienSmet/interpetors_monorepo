import { ChangeEvent, useState } from "react";
import { MdDownload, MdSave } from "react-icons/md";
import { useTranslation } from "react-i18next";

import { InputStyleLess } from "@/components";
import { useCssVariable } from "@/hooks";
import {
    downloadFolderAsZip,
    downloadVocabulary,
    useFoldersManager,
    useVocabularyTable,
    useWorkspaces,
} from "@/modules";

import "./manager.scss";

export const PreparationManager = () => {
    const [title, setTitle] = useState("");

    const inputSize = useCssVariable("--size-xl");
    const { foldersStructures } = useFoldersManager();
    const { t } = useTranslation();
    const { list } = useVocabularyTable();
    const { currentWorkspace } = useWorkspaces();

    const { languages, nativeLanguage } = currentWorkspace!;

    const headerToUse = [
        t("vocabulary.sources"),
        nativeLanguage,
        ...languages.filter(lng => lng !== nativeLanguage)
    ];

    const handleDownloadVoc = () => downloadVocabulary(list, headerToUse);
    const handleDownloadFolders = () => downloadFolderAsZip(foldersStructures);
    const onChange = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
    const savePreparation = () => {
        const params = {
            foldersStructures,
            title,
            vocabulary: {
                languages,
                list,
            },
        };
        console.log(JSON.stringify({ params }));
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
                    disabled={foldersStructures.length === 0}
                    onClick={handleDownloadFolders}
                    title={foldersStructures.length === 0
                        ? t("folders.empty")
                        : t("folders.download")}
                >
                    <MdDownload />
                    <span>{t("views.new.buttons.downloadFiles")}</span>
                </button>
                <button
                    disabled={list.length === 0}
                    onClick={handleDownloadVoc}
                    title={list.length === 0
                        ? t("vocabulary.empty")
                        : t("views.new.buttons.downloadVocabulary")
                    }
                >
                    <MdDownload />
                    <span>{t("views.new.buttons.downloadVocabulary")}</span>
                </button>
                <button
                    onClick={savePreparation}
                    title={t("onConstruction")}
                >
                    <MdSave />
                    <span>{t("views.new.buttons.save")}</span>
                </button>
            </div>
        </div>
    );
};
