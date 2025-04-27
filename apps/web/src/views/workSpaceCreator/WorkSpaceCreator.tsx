import { MdClear } from "react-icons/md";
import { useTranslation } from "react-i18next";

import { Button, LanguageSelect } from "@/components";
import { useCssVariable } from "@/hooks";

import { creationSteps, useWorkSpaceCreator, WorkSpaceCreatorState } from "./useWorkSpaceCreator";
import "./workSpaceCreator.scss";

type WorkLanguagesListProps = {
    readonly handleNativeLanguage: (language: string) => void;
    readonly removeWorkLanguage: (language: string) => void;
    readonly workspaceCreatorState: WorkSpaceCreatorState;
};
const WorkLanguagesList = (props: WorkLanguagesListProps) => {
    const {
        handleNativeLanguage,
        removeWorkLanguage,
        workspaceCreatorState,
    } = props;

    const { t } = useTranslation();

    if (workspaceCreatorState.currentStep === creationSteps[0]) {
        return (
            <div className={`work-languages__list`}>
                {workspaceCreatorState.workSpace.languages.work.map(language => (
                    <div
                        className={`work-language ${workspaceCreatorState.workSpace.languages.native === language ? "selected" : ""}`}
                        key={language}
                    >
                        <p>{language}</p>
                        {workspaceCreatorState.currentStep === creationSteps[0] && (
                            <MdClear onClick={() => removeWorkLanguage(language)} />
                        )}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            <p>{t("views.workspace.inputs.native-language.label")}</p>
            <div className="work-languages__list active">
                {workspaceCreatorState.workSpace.languages.work.map(language => (
                    <div
                        className={`work-language ${workspaceCreatorState.workSpace.languages.native === language ? "selected" : ""}`}
                        key={language}
                        onClick={() => handleNativeLanguage(language)}
                    >
                        <p>{language}</p>
                    </div>
                ))}
            </div>
        </>
    );
};

export const WorkSpaceCreator = () => {
    const {
        workspaceCreatorState,
        handleNativeLanguage,
        nextStep,
        pushWorkLanguage,
        removeWorkLanguage,
    } = useWorkSpaceCreator();

    const { t } = useTranslation();

    return (
        <main className="workspace">
            <h1>{t("views.workspace.title")}</h1>
            <div className="field-container">
                <div className={`step work-languages ${workspaceCreatorState.currentStep === creationSteps[0] ? "active" : ""}`}>
                    <label htmlFor="work-languages">
                        {t("views.workspace.inputs.work-languages.label")}
                    </label>
                    <LanguageSelect
                        name="work-languages"
                        onChange={pushWorkLanguage}
                        style={{ backgroundColor: useCssVariable("--clr-bg") }}
                    />
                </div>
                {workspaceCreatorState.workSpace.languages.work.length !== 0 && (
                    <WorkLanguagesList
                        handleNativeLanguage={handleNativeLanguage}
                        removeWorkLanguage={removeWorkLanguage}
                        workspaceCreatorState={workspaceCreatorState}
                    />
                )}
            </div>
            <Button
                label={t(workspaceCreatorState.currentStep === creationSteps[0]
                    ? "actions.confirm"
                    : "actions.workspace.create"
                )}
                disabled={workspaceCreatorState.currentStep === creationSteps[0]
                    ? workspaceCreatorState.workSpace.languages.work.length < 2
                    : (
                        workspaceCreatorState.workSpace.languages.native === "" ||
                        workspaceCreatorState.workSpace.languages.work.findIndex(el => el === workspaceCreatorState.workSpace.languages.native) === -1
                    )
                }
                onClick={nextStep}
            />
        </main>
    );
};
