import { MdClear } from "react-icons/md";
import { Trans, useTranslation } from "react-i18next";

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
            <p>{t("workspaces.create.inputs.native-language.label")}</p>
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
            <div className="workspace-layout">
                <div className="workspace-header">
                    <Trans
                        i18nKey="onBoarding.title"
                        components={{
                            default: <p className="workspace-title"></p>,
                            title: <span></span>
                        }}
                    />
                    <p className="workspace-subtitle">{t("onBoarding.subtitle")}</p>
                </div>
                <div className="workspace-content">
                    <p className="workspace-create-title">{t("workspaces.create.title")}</p>
                    <div className="workspace-fields">
                        <div className={`step work-languages ${workspaceCreatorState.currentStep === creationSteps[0] ? "active" : ""}`}>
                            <p>
                                1. {t("workspaces.create.inputs.work-languages.label")}
                            </p>
                            <LanguageSelect
                                name="work-languages"
                                onChange={pushWorkLanguage}
                                style={{ backgroundColor: useCssVariable("--clr-bg") }}
                            />
                        </div>
                        {workspaceCreatorState.workSpace.languages.work.length !== 0
                            ? (
                                <WorkLanguagesList
                                    handleNativeLanguage={handleNativeLanguage}
                                    removeWorkLanguage={removeWorkLanguage}
                                    workspaceCreatorState={workspaceCreatorState}
                                />
                            )
                            : <div style={{ height: 29.5 }} />
                        }
                    </div>
                    <Button
                        label={t(workspaceCreatorState.currentStep === creationSteps[0]
                            ? "actions.confirm"
                            : "actions.workspaces.create"
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
                </div>
            </div>
            <div className="image-container">
                <img src="/images/home-bg.webp" alt="translate bg" />
            </div>
        </main>
    );
};
