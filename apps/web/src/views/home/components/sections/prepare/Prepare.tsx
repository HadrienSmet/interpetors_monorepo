"use client"

import { useState } from "react";

import { LanguageSelect } from "@/components";
import { useTranslation } from "@/contexts";
import { useCssVariable } from "@/hooks";

import "./prepare.scss";
import { MdClear } from "react-icons/md";

type PrepareState = {
    languages: {
        native: string | null;
        work: Array<string>;
    };
}
export const Prepare = () => {
    const [prepareState, setPrepareState] = useState<PrepareState>({
        languages: {
            native: null,
            work: [],
        },
    })

    const { t } = useTranslation();

    const pushWorkLanguage = (language: string) => setPrepareState(state => ({
        ...state,
        languages: {
            ...state.languages,
            work: state.languages.work.includes(language) 
                ? state.languages.work 
                : [...state.languages.work, language],
        },
    }));
 
    return (
        <section className="prepare">
            <h1>{t("views.prepare.title")}</h1>
			<div className="work-languages">
                <label htmlFor="work-languages">{t("views.prepare.inputs.languages")}</label>
                <LanguageSelect backgroundColor={useCssVariable("--clr-bg")!} name="work-languages" onChange={pushWorkLanguage} />
                <div className="work-languages__list">
                    {prepareState.languages.work.length !== 0 && prepareState.languages.work.map(language => (
                        <div className="work-language" key={language}>
                            <p>{language}</p>
                            <MdClear />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
};
