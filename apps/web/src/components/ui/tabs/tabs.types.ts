import { ReactNode } from "react";

export type TabsView = {
	readonly buttonTitle?: string;
	readonly content: ReactNode;
	readonly title: string | ReactNode;
};

export type TabsTabBarItem = {
	readonly buttonTitle?: string;
	readonly index: number;
	readonly onClick: () => void;
	readonly panelId: string;
	readonly selected: boolean;
	readonly tabId: string;
	readonly title: string | ReactNode;
};
