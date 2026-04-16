import { RefObject, useEffect, useRef } from "react";
import { useSearchParams } from "react-router";

import { scrollToChild, URL_PARAMETERS } from "@/utils";

import { usePreparations } from "../../contexts";

import { CreateButton } from "../createButton";
import { PreparationLayout } from "../layout";
import { PreparationsList } from "../list";

import "./preparationsFilled.scss";

const TABS_NAMES = {
    list: "list",
    tabs: "tabs",
} as const;
type TabsNames = typeof TABS_NAMES[keyof typeof TABS_NAMES];

export const PreparationsFilled = () => {
    const currentTarget = useRef<TabsNames>(TABS_NAMES.list);
    const listRef = useRef<HTMLDivElement>(null);
    const tabsRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);

    const { setSelectedPreparation } = usePreparations();
    const [searchParams, setSearchParams] = useSearchParams();

    const scrollTo = (targetRef: RefObject<HTMLDivElement | null>, targetName: TabsNames) => {
        const viewport = viewportRef.current;
        const target = targetRef.current;
        currentTarget.current = targetName;

        if (!viewport || !target) return;
        scrollToChild(viewport, target, true);
    };

    const scrollToList = () => scrollTo(listRef, TABS_NAMES.list);
    const scrollToTabs = () => scrollTo(tabsRef, TABS_NAMES.tabs);

    const backToList = () => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);

            next.delete(URL_PARAMETERS.preparationid);
            next.delete(URL_PARAMETERS.view);

            return (next);
        });

        setSelectedPreparation(undefined);
        scrollToList();
    };

    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        const realignToCurrentTarget = (smooth: boolean) => {
            const target = currentTarget.current === TABS_NAMES.tabs
                ? tabsRef.current
                : listRef.current;
            if (!target) return;

            // Realign only if there is a delta
            const vp = viewport.getBoundingClientRect();
            const tg = target.getBoundingClientRect();
            const delta = tg.left - vp.left;
            if (Math.abs(delta) > 1) {
                scrollToChild(viewport, target, smooth);
            }
        };

        const observer = new ResizeObserver(() => realignToCurrentTarget(false));
        observer.observe(viewport);

        const onLayoutResized = () => realignToCurrentTarget(false);
        window.addEventListener("layout-resized", onLayoutResized);

        return () => {
            observer.disconnect();
            window.removeEventListener("layout-resized", onLayoutResized);
        };
    }, []);
    useEffect(() => {
        const path = searchParams.get(URL_PARAMETERS.preparationid);
        if (!path) return;

        setSelectedPreparation(path);
        scrollToTabs();
    }, [searchParams.toString()]);

    return (
        <div className="preparations-filled">
            <div
                className="preparations-viewport"
                ref={viewportRef}
            >
                <div
                    className="preparations-list-container"
                    ref={listRef}
                >
                    <PreparationsList />
                    <CreateButton />
                </div>
                <div
                    className="preparation-tabs-container"
                    ref={tabsRef}
                >
                    <PreparationLayout
                        backToList={backToList}
						editable
                        scrollableParentRef={viewportRef}
                    />
                </div>
            </div>
        </div>
    );
};
