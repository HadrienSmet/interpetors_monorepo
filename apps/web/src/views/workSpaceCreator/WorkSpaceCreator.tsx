import { PiX } from "react-icons/pi";
import { Trans, useTranslation } from "react-i18next";

import { Button, LanguageSelect } from "@/components";
import { useCssVariable } from "@/hooks";
import {
    CreateWorkspaceParams,
    CreationStep,
    creationSteps,
    useWorkSpaceCreator,
} from "@/modules/workspace";
import { capitalize, getNativeName } from "@/utils";

import "./workSpaceCreator.scss";

type WorkLanguagesListProps = {
    readonly handleNativeLanguage: (language: string) => void;
    readonly removeWorkLanguage: (language: string) => void;
    readonly creationStep: CreationStep;
    readonly workspace: CreateWorkspaceParams;
};
const WorkLanguagesList = (props: WorkLanguagesListProps) => {
    const {
        handleNativeLanguage,
        removeWorkLanguage,
        creationStep,
        workspace,
    } = props;

    const { t } = useTranslation();

    if (creationStep === creationSteps[0]) {
        return (
            <div className={`work-languages__list`}>
                {workspace.languages.map(language => (
                    <div
                        className={`work-language ${workspace.nativeLanguage === language ? "selected" : ""}`}
                        key={language}
                    >
                        <p>{capitalize(getNativeName(language) ?? "")}</p>
                        <PiX onClick={() => removeWorkLanguage(language)} />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            <p>{t("workspaces.onboarding.inputs.native-language.label")}</p>
            <div className="work-languages__list active">
                {workspace.languages.map(language => (
                    <div
                        className={`work-language ${workspace.nativeLanguage === language ? "selected" : ""}`}
                        key={language}
                        onClick={() => handleNativeLanguage(language)}
                    >
                        <p>{capitalize(getNativeName(language) ?? "")}</p>
                    </div>
                ))}
            </div>
        </>
    );
};

export const WorkspaceCreator = () => {
    const {
        creationStep,
        handleNativeLanguage,
        isPending,
        nextStep,
        pushLanguage,
        removeLanguage,
        workspace,
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
                    <p className="workspace-create-title">{t("workspaces.onboarding.title")}</p>
                    <div className="workspace-fields">
                        <div className={`step work-languages ${creationStep === creationSteps[0] ? "active" : ""}`}>
                            <p>
                                1. {t("workspaces.onboarding.inputs.work-languages.label")}
                            </p>
                            <LanguageSelect
                                name="work-languages"
                                onChange={pushLanguage}
                                style={{ backgroundColor: useCssVariable("--clr-bg") }}
                            />
                        </div>
                        {workspace.languages.length !== 0
                            ? (
                                <WorkLanguagesList
                                    handleNativeLanguage={handleNativeLanguage}
                                    removeWorkLanguage={removeLanguage}
                                    workspace={workspace}
                                    creationStep={creationStep}
                                />
                            )
                            : <div style={{ height: 29.5 }} />
                        }
                    </div>
                    <Button
                        label={t(creationStep === creationSteps[0]
                            ? "actions.confirm"
                            : "actions.workspaces.create"
                        )}
                        disabled={creationStep === creationSteps[0]
                            ? workspace.languages.length < 2
                            : (
                                workspace.nativeLanguage === "" ||
                                workspace.languages.findIndex(el => el === workspace.nativeLanguage) === -1
                            )
                        }
                        isPending={isPending}
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
