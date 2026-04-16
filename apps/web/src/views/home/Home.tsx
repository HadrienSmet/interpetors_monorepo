import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";

import { TabsBar, TabsPanels, useTabs } from "@/components";
import { useLocale } from "@/hooks";
import { useAppHeader } from "@/layout/header";
import { ColorPanelsSection } from "@/modules/colorPanel";
import { WorkspacesSection } from "@/modules/workspace";
import { URL_PARAMETERS } from "@/utils";

import "./home.scss";

export const Home = () => {
	const [initialTabIndex, setInitialTabIndex] = useState(0);

	const { setViewNode } = useAppHeader();
	const { locale } = useLocale();
	const [searchParams, setSearchParams] = useSearchParams();
	const { t } = useTranslation();

	const views = useMemo(() => [
		{
			buttonTitle: t("workspaces.title"),
			content: <WorkspacesSection />,
			title: (<p>{t("workspaces.title")}</p>),
		},
		{
			buttonTitle: t("colorPanel.title"),
			content: <ColorPanelsSection />,
			title: (<p>{t("colorPanel.title")}</p>),
		},
	], [locale]);
	const viewTitles = ["workspaces", "color-panels"];

	const tabs = useTabs({ views });

	const headerNode = useMemo(() => (
		<div className="view-navigation">
			<div className="divider" />
			<TabsBar items={tabs.items} />
		</div>
	), [tabs.tabIndex, tabs.items]);

	useEffect(() => {
		setViewNode(headerNode);
		return () => setViewNode(null);
	}, [setViewNode, headerNode]);

	useEffect(() => {
		const path = searchParams.get(URL_PARAMETERS.view);
		if (!path) return;

		setInitialTabIndex(Math.max(viewTitles.findIndex(elem => elem === path), 0));
	}, [searchParams.toString(), views]);

	return (
		<main className="home">
			<TabsPanels
				activeIndex={tabs.tabIndex}
				ids={tabs.ids}
				views={tabs.views}
			/>
		</main>
	);
};
