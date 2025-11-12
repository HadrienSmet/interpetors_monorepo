import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";

import { scrollToChild } from "@/utils";

import "./tabs.scss";

const DEFAULT_INDEX = 0 as const;

export type TabsView = {
    readonly title: string | ReactNode;
    readonly content: ReactNode;
};

type TabsProps = {
    readonly views: Array<TabsView>;
    /** id prefix to avoid ARIA collisions if multiple Tabs on the page */
    readonly idPrefix?: string;
    /** (optionnel) initial index */
    readonly initialIndex?: number;
    /** (optionnel) callback when active view changes */
    readonly onChange?: (index: number) => void;
};

export const Tabs: React.FC<TabsProps> = ({
    views,
    idPrefix = "tabs",
    initialIndex = DEFAULT_INDEX,
    onChange,
}) => {
    const [tabIndex, setTabIndex] = useState<number>(0);

    // refs
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
    panelRefs.current = views.map((_, i) => panelRefs.current[i] ?? null);

    const onChangeRef = useRef(onChange);
    useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

    // ids ARIA
    const ids = useMemo(() => (
        views.map((_, i) => ({
            tab: `${idPrefix}-tab-${i}`,
            panel: `${idPrefix}-panel-${i}`,
        }))
    ),
    [views, idPrefix]);


    const scrollToIndex = (i: number) => {
        const viewport = viewportRef.current;
        const panel = panelRefs.current[i];
        if (!viewport || !panel) return;
        scrollToChild(viewport, panel, true);
    };

    const handleClickTab = (i: number) => {
        setTabIndex(i);
        // re-scroll après le reflow de la vue (au cas où le contenu s'élargit)
        requestAnimationFrame(() => scrollToIndex(i));
    };

    useEffect(() => {
        setTabIndex(Math.min(Math.max(initialIndex, 0), Math.max(views.length - 1, 0)));
    }, [initialIndex, views.length]);
    useEffect(() => {
        onChangeRef.current?.(tabIndex);
    }, [tabIndex]);
    useEffect(() => {
        const eventType = "layout-resized";
        const viewport = viewportRef.current;
        if (!viewport) return;

        const observer = new ResizeObserver(() => {
            const panel = panelRefs.current[tabIndex];
            if (panel) scrollToChild(viewport, panel, false);
        });
        observer.observe(viewport);

        const onLayoutResized = () => {
            const panel = panelRefs.current[tabIndex];
            if (panel) scrollToChild(viewport, panel, false);
        };
        window.addEventListener(eventType, onLayoutResized);

        return () => {
            observer.disconnect();
            window.removeEventListener(eventType, onLayoutResized);
        };
    }, [tabIndex]);

    if (views.length === 0) {
        return (null);
    }

    return (
        <div className="tabs">
            {/* TabBar */}
            <div
                className="tabs__tabbar"
                role="tablist"
                aria-label="Views"
            >
                {views.map((view, i) => {
                    const selected = i === tabIndex;
                    return (
                        <button
                            key={i}
                            id={ids[i].tab}
                            role="tab"
                            aria-selected={selected}
                            aria-controls={ids[i].panel}
                            tabIndex={selected ? 0 : -1}
                            className={`tabs__tab ${selected ? "is-active" : ""}`}
                            onClick={() => handleClickTab(i)}
                            type="button"
                        >
                            {view.title}
                        </button>
                    );
                })}
            </div>

            <div
                className="tabs__viewport"
                ref={viewportRef}
            >
                <div className="tabs__track">
                    {views.map((view, i) => (
                        <div
                            aria-labelledby={ids[i].tab}
                            className="tabs__panel"
                            data-index={i}
                            id={ids[i].panel}
                            key={i}
                            ref={(el) => { panelRefs.current[i] = el; }}
                            role="tabpanel"
                        >
                            {view.content}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
