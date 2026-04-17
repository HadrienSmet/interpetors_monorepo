import { PiShield } from "react-icons/pi";
import { useTranslation } from "react-i18next";

import { useWorkspaces } from "../../context";

import { WorkspaceForm } from "../form";
import { WorkspacesList } from "../list";

import "./workspacesSection.scss";

export const WorkspacesSection = () => {
	const { t } = useTranslation();
	const { workspaces } = useWorkspaces();

	const prepLength = Object.values(workspaces).reduce((sum, workspace) => sum + workspace._count.preparations, 0);
	const termsLength = Object.values(workspaces).reduce((sum, workspace) => sum + workspace._count.vocabularyTerms, 0);

	return (
		<section className="workspaces__section">
			<div className="home__section-header">
				<h1>{t("workspaces.title")}</h1>
			</div>
			<div className="workspaces__body">
				<WorkspacesList />
				<WorkspaceForm />
			</div>
			<div className="workspaces__footer">
				<div className="workspaces__stats">
					<div className="workspaces__kpi">
						<p className="key">{t("workspaces.kpis.preparations", { count: prepLength })}</p>
						<p className="value">{prepLength}</p>
					</div>
					<div className="workspaces__kpi">
						<p className="key">{t("workspaces.kpis.terms", { count: termsLength })}</p>
						<p className="value">{termsLength}</p>
					</div>
				</div>
				<div className="workspaces__security">
					<PiShield />
					<span>{t("workspaces.encryption")}</span>
				</div>
			</div>
		</section>
	);
};
