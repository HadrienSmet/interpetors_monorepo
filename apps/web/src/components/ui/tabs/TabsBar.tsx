import { TabsTabBarItem } from "./tabs.types";
import "./tabs.scss";

type TabsBarProps = {
	readonly items: Array<TabsTabBarItem>;
};

export const TabsBar = ({ items }: TabsBarProps) => (
	<div 
		aria-label="Views" 
		className="tabs__tabbar" 
		role="tablist"
	>
		{items.map((item) => (
			<button
				key={item.index}
				aria-selected={item.selected}
				aria-controls={item.panelId}
				className={`tabs__tab ${item.selected ? "is-active" : ""}`}
				id={item.tabId}
				onClick={item.onClick}
				role="tab"
				tabIndex={item.selected ? 0 : -1}
				type="button"
			>
				{item.title}
			</button>
		))}
	</div>
);
