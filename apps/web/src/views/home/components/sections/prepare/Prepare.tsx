"use client"

import { ChangeEvent, useState } from "react";
import { MdClear } from "react-icons/md";

import { FolderDropzone, LanguageSelect, Select } from "@/components";
import { useTranslation } from "@/contexts";
import { useCssVariable } from "@/hooks";

import "./prepare.scss";

type PrepareState = {
    languages: {
        native: string | null;
        work: Array<string>;
    };
};
export const Prepare = () => {
    const [prepareState, setPrepareState] = useState<PrepareState>({
        languages: {
            native: null,
            work: [],
        },
    });

    const { t } = useTranslation();

    const handleNativeLanguage = (language: string) => setPrepareState(state => ({
        ...state,
        languages: {
            ...state.languages,
            native: language,
        }
    }))
    const pushWorkLanguage = (language: string) => setPrepareState(state => ({
        ...state,
        languages: {
            ...state.languages,
            work: state.languages.work.includes(language)
                ? state.languages.work
                : [...state.languages.work, language],
        },
    }));
    const removeWorkLanguage = (languageToRemove: string) => setPrepareState(state => ({
        ...state,
        languages: {
            ...state.languages,
            work: state.languages.work.filter(language => language !== languageToRemove)
        },
    }));

    const onNativeLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => handleNativeLanguage(e.target.value)

    return (
        <section className="prepare">
            <h1>{t("views.prepare.title")}</h1>
			<div className="work-languages">
                <label htmlFor="work-languages">
                    {t("views.prepare.inputs.work-languages")}
                </label>
                <LanguageSelect
                    backgroundColor={useCssVariable("--clr-bg")!}
                    name="work-languages"
                    onChange={pushWorkLanguage}
                />
                <div className="work-languages__list">
                    {prepareState.languages.work.length !== 0 && prepareState.languages.work.map(language => (
                        <div className="work-language" key={language}>
                            <p>{language}</p>
                            <MdClear onClick={() => removeWorkLanguage(language)} />
                        </div>
                    ))}
                </div>
            </div>
			<div className="native-language">
                <label htmlFor="native-language">
                    {t("views.prepare.inputs.native-language.label")}
                </label>
                <Select
                    backgroundColor={useCssVariable("--clr-bg")!}
                    name="native-language"
                    disabled={prepareState.languages.work.length < 2}
                    options={prepareState.languages.work.length > 0
                        ? prepareState.languages.work.map(language => ({ value: language, label: language }))
                        : [{ value: "none", label: t("views.prepare.inputs.native-language.placeholder") }]
                    }
                    onChange={onNativeLanguageChange}
                />
            </div>
            <div className="meeting-documents">
                <label htmlFor="meeting-documents">
                    {t("views.prepare.inputs.meeting-documents")}
                </label>
                <FolderDropzone />
            </div>
        </section>
    );
};
