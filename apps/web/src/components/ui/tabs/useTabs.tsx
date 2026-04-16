import { useEffect, useMemo, useState } from "react";

import { TabsTabBarItem, TabsView } from "./tabs.types";

type UseTabsParams = {
	readonly idPrefix?: string;
	readonly initialIndex?: number;
	readonly onChange?: (index: number) => void;
	readonly views: Array<TabsView>;
};

export const useTabs = ({
	idPrefix = "tabs",
	initialIndex = 0,
	onChange,
	views,
}: UseTabsParams) => {
	const [tabIndex, setTabIndex] = useState<number>(initialIndex);

	const ids = useMemo(() =>
		views.map((_, i) => ({
			tab: `${idPrefix}-tab-${i}`,
			panel: `${idPrefix}-panel-${i}`,
		})),
	[views, idPrefix], );

	useEffect(() => {
		setTabIndex(Math.min(Math.max(initialIndex, 0), Math.max(views.length - 1, 0)));
	}, [initialIndex, views.length]);

	useEffect(() => {
		onChange?.(tabIndex);
	}, [tabIndex, onChange]);

	const items = useMemo<Array<TabsTabBarItem>>(() =>
		views.map((view, i) => ({
			buttonTitle: view.buttonTitle,
			index: i,
			onClick: () => setTabIndex(i),
			panelId: ids[i].panel,
			selected: i === tabIndex,
			tabId: ids[i].tab,
			title: view.title,
		})
	), [views, ids, tabIndex]);

	return ({
		ids,
		items,
		tabIndex,
		setTabIndex,
		views,
	});
};