import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Accordion } from "@/components";

import { useWorkspaces } from "../../context";

import { WorkspaceCard } from "../card";

import "./workspacesList.scss";

export const WorkspacesList = () => {
	const [editingItem, setEditingItem] = useState<string | undefined>(undefined);

	const { t } = useTranslation();
	const { workspaces } = useWorkspaces();

	const items = Object.values(workspaces).map(workspace => (
		WorkspaceCard({ editingItem, setEditingItem, workspace })
	));
	
	return (
		<div className="workspaces-list">
			<h2>{t("workspaces.list")}</h2>
			<Accordion items={items} />
        </div>
	);
};
