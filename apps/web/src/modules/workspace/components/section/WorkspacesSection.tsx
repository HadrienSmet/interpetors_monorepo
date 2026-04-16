import { PiShield } from "react-icons/pi";
import { useTranslation } from "react-i18next";

import { WorkspaceForm } from "../form";
import { WorkspacesList } from "../list";

import "./workspacesSection.scss";

export const WorkspacesSection = () => {
	const { t } = useTranslation();

	const prepLength = 6 as const;
	const termsLength = 64 as const;

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
