import { ChangeEvent, useMemo, useState } from "react";
import { MdCheck, MdClear, MdDelete, MdEdit } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { Button, InputStyleLess, LanguageSelect } from "@/components";
import { useWorkspaces, Workspace } from "@/modules";
import { capitalize, getNativeName } from "@/utils";

import "./workspaces.scss";

type LanguagesListProps = {
    readonly handleNative?: (lng: string) => void;
    readonly languages: Array<string>;
    readonly nativeLanguage: string;
    readonly removeLanguage?: (lng: string) => void;
};
const LanguagesList = ({ handleNative, languages, nativeLanguage, removeLanguage }: LanguagesListProps) => {
    return (
        <div className="workspace-languages">
            {languages.map(language => (
                <div
                    className={`language ${nativeLanguage === language ? "native" : ""} ${handleNative ? "editing" : ""}`}
                    onClick={handleNative
                        ? () => handleNative(language)
                        : () => null
                    }
                    key={language}
                >
                    <p>{capitalize(getNativeName(language) ?? "")}</p>
                    {removeLanguage && (
                        <MdClear onClick={() => removeLanguage(language)} />
                    )}
                </div>
            ))}
        </div>
    );
};

type WorkspaceContainerProps = {
    readonly workspace: Workspace;
};
const WorkspaceContainer = (props: WorkspaceContainerProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [workspace, setWorkspace] = useState({ ...props.workspace });

    const { t } = useTranslation();
    const { currentWorkspace, changeWorkspace, removeWorkspace, updateWorkspace, workspaces } = useWorkspaces();

    const handleNative = (lng: string) => setWorkspace(state => ({
        ...state,
        nativeLanguage: lng,
    }));
    const handleTitle = (e: ChangeEvent<HTMLInputElement>) => setWorkspace(state => ({
        ...state,
        name: e.target.value,
    }));
    const pushLanguage = (lng: string) => setWorkspace(state => ({
        ...state,
        languages: [...state.languages, lng],
    }));
    const remove = () => removeWorkspace(workspace.id);
    const removeLanguage = (lng: string) => setWorkspace(state => ({
        ...state,
        languages: state.languages.filter(language => language !== lng),
    }));
    const onSubmit = async () => {
        setIsPending(true);
        await updateWorkspace({
            body: workspace,
            id: workspace.id,
        });
        setIsPending(false);
        setIsEditing(false);
    };
    const toggleEdit = () => setIsEditing(state => !state);
    const languagesListProps = useMemo(() => (
        isEditing
            ? ({
                handleNative,
                removeLanguage
            })
            : {}
    ), [isEditing]);

    return (
        <div className="workspace-container">
            <div className="workspace-data">
                {isEditing
                    ? (
                        <>
                            <InputStyleLess
                                onChange={handleTitle}
                                value={workspace.name}
                            />
                            <LanguageSelect
                                name="workspace-languages"
                                onChange={pushLanguage}
                            />
                        </>
                    )
                    : <p>{workspace.name} {workspace.id === currentWorkspace?.id && <MdCheck />}</p>
                }
                <LanguagesList
                    {...workspace}
                    {...languagesListProps}
                />
                {workspace.colorPanelId && (
                    <p>{t("colorPanel.user", { name: workspace.name })}</p>
                )}
                <p>{t("workspaces.stats.preparation", { count: 0 })}</p>
                <p>{t("workspaces.stats.vocabulary", { count: 0 })}</p>
                <p>{t("workspaces.stats.encyclopedy", { count: 0 })}</p>
                {isEditing && (
                    <Button
                        isPending={isPending}
                        label="Submit"
                        onClick={onSubmit}
                    />
                )}
            </div>
            <div className="workspace-actions">
                <button
                    className={`workspace-selector ${workspace.id === currentWorkspace?.id ? "active" : ""}`}
                    disabled={workspace.id === currentWorkspace?.id}
                    onClick={() => changeWorkspace(workspace.id)}
                >
                    <MdCheck />
                </button>
                <button onClick={toggleEdit}>
                    <MdEdit />
                </button>
                <button
                    disabled={Object.keys(workspaces).length < 2}
                    onClick={remove}
                >
                    <MdDelete />
                </button>
            </div>
        </div>
    );
};

export const Workspaces = () => {
    const { t } = useTranslation();
    const { workspaces } = useWorkspaces();

    return (
        <div className="workspaces-screen">
            <div className="workspaces-list">
                {Object.values(workspaces).map(workspace => (
                    <WorkspaceContainer
                        key={workspace.id}
                        workspace={workspace}
                    />
                ))}
            </div>
            <Link to="/workspace">
                {t("workspaces.new")}
            </Link>
        </div>
    );
};
