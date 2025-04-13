"use client"

import { useState } from "react";
import { MdClear } from "react-icons/md";

import { FolderDropzone, Input, LanguageSelect } from "@/components";
import { useTranslation } from "@/contexts";
import { useCssVariable } from "@/hooks";

import "./prepare.scss";

type PrepareState = {
    readonly folders: undefined;
    readonly languages: {
        readonly native: string | null;
        readonly work: Array<string>;
    };
    readonly title: string;
};
export const Prepare = () => {
    const [prepareState, setPrepareState] = useState<PrepareState>({
        folders: undefined,
        languages: {
            native: null,
            work: [],
        },
        title: "",
    });

    const { t } = useTranslation();

    const handleNativeLanguage = (language: string) => setPrepareState(state => ({
        ...state,
        languages: {
            ...state.languages,
            native: language,
        },
    }));
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
            work: state.languages.work.filter(language => language !== languageToRemove),
        },
    }));

    return (
        <main className="prepare">
            <div className="prepare-header">
                <h1>{t("home.new.title")}</h1>
                <div className="preparation-color" />
            </div>
            {/* Preparation title */}
			<div className="field">
                <label htmlFor="preparation-title">
                    {t("home.new.inputs.title")}
                </label>
                <Input
                    backgroundColor={useCssVariable("--clr-bg")!}
                    name="preparation-title"
                    onChange={() => console.log("Hello")}
                    placeholder="Economy"
                />
            </div>
            {/* Work languages Input */}
			<div className="field work-languages">
                <label htmlFor="work-languages">
                    {t("home.new.inputs.work-languages")}
                </label>
                <LanguageSelect
                    backgroundColor={useCssVariable("--clr-bg")!}
                    name="work-languages"
                    onChange={pushWorkLanguage}
                />
                {prepareState.languages.work.length !== 0 && (
                    <>
                        <p>{t("home.new.inputs.native-language")}</p>
                        <div className="work-languages__list">
                            {prepareState.languages.work.map(language => (
                                <div
                                    className={`work-language ${prepareState.languages.native === language ? "selected" : ""}`}
                                    key={language}
                                    onClick={() => handleNativeLanguage(language)}
                                >
                                    <p>{language}</p>
                                    <MdClear onClick={() => removeWorkLanguage(language)} />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
            {/* Meeting documents */}
            <div>
                <label htmlFor="meeting-documents">
                    {t("home.new.inputs.meeting-documents")}
                </label>
                <FolderDropzone />
            </div>
        </main>
    );
};
