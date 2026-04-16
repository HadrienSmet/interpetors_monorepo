import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PiLightbulb } from "react-icons/pi";

import { Loader } from "@/components";
import { useWorkspaces } from "@/modules/workspace";

import { useColorPanel } from "../../contexts";
import { ColorPanelInCreation } from "../../types";

import { ColorPanelCard } from "../card";
import { ColorPanelForm } from "../form";

import "./colorPanelsSection.scss";

export const ColorPanelsSection = () => {
	const [isPending, setIsPending] = useState(false);

	const { colorPanel, createPanel, isLoading } = useColorPanel();
	const { t } = useTranslation();
	const { currentWorkspace } = useWorkspaces();

	const submit = async (colorsRecord: ColorPanelInCreation) => {
		if (!currentWorkspace) return;
		setIsPending(true);
		await createPanel({ 
			...colorsRecord, 
			name: colorsRecord.name ?? "Default", 
			workspaceId: currentWorkspace.id, 
		});
		setIsPending(false);
	};

	if (isLoading) {
		return (<Loader />);
	}

	return (
		<section className="color-panels__section">
			<div className="home__section-header">
				<h1>{t("coloPanel.colorPanels.title")}</h1>
			</div>
			<div className="color-panels__body">
				{!colorPanel
					? (
						<div className="color-panels__missing">
							<p>{t("colorPanel.missing")}</p>
						</div>
					)
					: (
						<div className="color-panels__first-col">
							<div className="color-panels__list-container">
								<div className="color-panels__list">
									<ColorPanelCard colorPanel={colorPanel} />
								</div>
							</div>
							<div className="color-panels__tips">
								<PiLightbulb size={24} />
								<p>{t("coloPanel.colorPanels.tips")}</p>
							</div>
						</div>
					)
				}

				<div className="color-panels__scd-col">
					<ColorPanelForm
						isPending={isPending}
						onSubmit={submit}
					/>
				</div>
			</div>
		</section>
	);
};
