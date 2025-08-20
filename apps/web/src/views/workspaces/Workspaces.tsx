import { MdCheck, MdDelete, MdEdit } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { useWorkSpaces } from "@/modules";

import "./workspaces.scss";

export const Workspaces = () => {
    const { t } = useTranslation();
    const { currentWorkspace, workspaces } = useWorkSpaces();

    return (
        <div className="workspaces-screen">
            <div className="workspaces-list">
                {Object.values(workspaces).map(workspace => (
                    <div
                        className="workspace-container"
                        key={workspace.id}
                    >
                        <div className="workspace-data">
                            <h2>{workspace.name} {workspace.id === currentWorkspace?.id && <MdCheck />}</h2>
                            <div className="workspace-languages">
                                {workspace.languages.map(lng => (
                                    <span
                                        key={lng}
                                        className={lng === workspace.nativeLanguage ? "native" : ""}
                                    >{lng}</span>
                                ))}
                            </div>
                            {workspace.colorPanelId && (
                                <p>{t("colorPanel.user", { name: workspace.name })}</p>
                            )}
                            <p>{t("workspaces.stats.preparation", { count: 0 })}</p>
                            <p>{t("workspaces.stats.vocabulary", { count: 0 })}</p>
                            <p>{t("workspaces.stats.encyclopedy", { count: 0 })}</p>
                        </div>
                        <div className="workspace-actions">
                            <button>
                                <MdEdit />
                            </button>
                            <button>
                                <MdDelete />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <Link to="/workspace">
                {t("workspaces.new")}
            </Link>
        </div>
    );
};
