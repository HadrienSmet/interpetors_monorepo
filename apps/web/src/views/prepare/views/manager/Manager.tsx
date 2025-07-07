import { ChangeEvent, useState } from "react";
import { MdDownload, MdSave } from "react-icons/md";
import { useTranslation } from "react-i18next";

import { InputStyleLess } from "@/components";
import { useCssVariable } from "@/hooks";

import "./manager.scss";

export const PreparationManager = () => {
    const [title, setTitle] = useState("");

    const inputSize = useCssVariable("--size-xl");
    const { t } = useTranslation();

    const onChange = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);

    return (
        <div className="preparation-manager">
            <div className="preparation-title">
                <InputStyleLess
                    onChange={onChange}
                    placeholder={t("views.new.inputs.title")}
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
                    disabled
                    title="Not implemented yet"
                >
                    <MdDownload />
                    <span>{t("views.new.buttons.downloadFiles")}</span>
                </button>
                <button
                    disabled
                    title="Not implemented yet"
                >
                    <MdDownload />
                    <span>{t("views.new.buttons.downloadVocabulary")}</span>
                </button>
                <button
                    disabled
                    title="Not implemented yet"
                >
                    <MdSave />
                    <span>{t("views.new.buttons.save")}</span>
                </button>
            </div>
        </div>
    );
};
