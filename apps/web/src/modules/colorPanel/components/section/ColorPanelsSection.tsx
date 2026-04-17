import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PiLightbulb } from "react-icons/pi";

import { Loader } from "@/components";
import { useWorkspaces } from "@/modules/workspace";

import { useColorPanel, useColorPanels } from "../../contexts";
import { ColorPanelInCreation, ColorPanelType } from "../../types";

import { ColorPanelCard } from "../card";
import { ColorPanelForm } from "../form";

import "./colorPanelsSection.scss";

export const ColorPanelsSection = () => {
	const [isPending, setIsPending] = useState(false);
	const [panelToUpdate, setPanelToUpdate] = useState<ColorPanelType | undefined>(undefined);

	const { createPanel, isLoading, updatePanel } = useColorPanel();
	const { colorPanels } = useColorPanels();
	const { t } = useTranslation();
	const { currentWorkspace } = useWorkspaces();

	const create = async (colorsRecord: ColorPanelInCreation) => {
		if (!currentWorkspace) return;
		
		setIsPending(true);
		await createPanel({ 
			...colorsRecord, 
			name: colorsRecord.name ?? "Default", 
			workspaceId: currentWorkspace.id, 
		});
		setIsPending(false); 
	};
	const submit = async (params: Omit<ColorPanelType, "id">) => {
		if (!panelToUpdate) return;

		setIsPending(true);
		await updatePanel({ ...params, id: panelToUpdate.id });
		setIsPending(false);
	};

	if (isLoading) {
		return (
			<div className="color-panels__loader">
				<Loader />
			</div>
		);
	}

	return (
		<section className="color-panels__section">
			<div className="home__section-header">
				<h1>{t("colorPanel.colorPanels.title")}</h1>
			</div>
			<div className="color-panels__body">
				{colorPanels.length === 0
					? (
						<div className="color-panels__first-col missing">
							<p>{t("colorPanel.missing")}</p>
						</div>
					)
					: (
						<div className="color-panels__first-col">
							<div className="color-panels__list-container">
								<div className="color-panels__list">
									{colorPanels.map(colorPanel => (
										<ColorPanelCard 
											colorPanel={colorPanel} 
											key={colorPanel.id}
											panelToUpdate={panelToUpdate}
											setPanelToUpdate={setPanelToUpdate}	
										/>
									))}
								</div>
							</div>
							<div className="color-panels__tips">
								<PiLightbulb size={24} />
								<p>{t("colorPanel.colorPanels.tips")}</p>
							</div>
						</div>
					)
				}

				<div className="color-panels__scd-col">
					{panelToUpdate === undefined
						? (
							<ColorPanelForm
								isPending={isPending}
								onSubmit={create}
							/>
						)
						: (
							<ColorPanelForm
								colorPanel={panelToUpdate}
								isPending={isPending}
								//@ts-expect-error
								onSubmit={submit}
							/>
						)
					}
					
				</div>
			</div>
		</section>
	);
};
