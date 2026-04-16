import { useEffect, useRef } from "react";

import { scrollToChild } from "@/utils";

import { TabsView } from "./tabs.types";
import "./tabs.scss";

type TabsPanelsProps = {
	readonly activeIndex: number;
	readonly ids: Array<{ 
		readonly panel: string; 
		readonly tab: string; 
	}>;
	readonly views: Array<TabsView>;
};

export const TabsPanels = ({ activeIndex, ids, views }: TabsPanelsProps) => {
	const viewportRef = useRef<HTMLDivElement | null>(null);
	const panelRefs = useRef<Array<HTMLDivElement | null>>([]);

	panelRefs.current = views.map((_, i) => panelRefs.current[i] ?? null);

	useEffect(() => {
		const viewport = viewportRef.current;
		const panel = panelRefs.current[activeIndex];

		if (!viewport || !panel) return;

		requestAnimationFrame(() => {
			scrollToChild(viewport, panel, true);
		});
	}, [activeIndex]);

	useEffect(() => {
		const eventType = "layout-resized";
		const viewport = viewportRef.current;

		if (!viewport) return;

		const scrollToActivePanel = () => {
			const panel = panelRefs.current[activeIndex];
			if (!panel) return;

			scrollToChild(viewport, panel, false);
		};

		const observer = new ResizeObserver(scrollToActivePanel);

		observer.observe(viewport);
		window.addEventListener(eventType, scrollToActivePanel);

		return () => {
			observer.disconnect();
			window.removeEventListener(eventType, scrollToActivePanel);
		};
	}, [activeIndex]);

	return (
		<div
			className="tabs__viewport"
			ref={viewportRef}
		>
			<div className="tabs__track">
				{views.map((view, i) => (
					<div
						key={i}
						aria-labelledby={ids[i].tab}
						aria-hidden={i !== activeIndex}
						className="tabs__panel"
						id={ids[i].panel}
						ref={(el) => {
							panelRefs.current[i] = el;
						}}
						role="tabpanel"
					>
						{view.content}
					</div>
				))}
			</div>
		</div>
	);
};