import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PiFolderFill } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";

import { TabsBar, TabsPanels, useTabs } from "@/components/ui";
import { useAppHeader } from "@/layout/header";
import { FOLDERS_TYPES, FoldersDisplayer, FolderDropzone, useFoldersManager } from "@/modules/folders";
import { VocabularyTable } from "@/modules/vocabulary";
import { URL_PARAMETERS } from "@/utils";

import { usePreparation } from "../../contexts";
import { PreparationWrapper } from "../../wrappers";

import "./preparationLayout.scss";

type PreparationLayoutProps = {
	readonly backToList: () => void;
	readonly editable?: boolean;
	readonly isNew?: boolean;
	readonly scrollableParentRef?: RefObject<HTMLDivElement | null>;
};

// type PreparationLayoutContentProps = Omit<PreparationLayoutProps, "preparation">;

const PreparationLayoutContent = () => {
	const [initialTabIndex, setInitialTabIndex] = useState(0);

	const tabsViewRef = useRef<HTMLDivElement>(null);

	const { setViewNode } = useAppHeader();
	const { isEditable } = useFoldersManager();
	const { preparation } = usePreparation();
	const [searchParams, setSearchParams] = useSearchParams();
	const { t } = useTranslation();

	const viewTitles = useMemo(() => ["folders", "vocabulary"], []);

	const views = useMemo(() => [
		{
			content: (
				<div className="preparation-folders">
					<FoldersDisplayer type={FOLDERS_TYPES.UNEDITABLE} />
				</div>
			),
			title: t("folders.label"),
		},
		{
			content: (
				<div className="preparation-vocabulary">
					<VocabularyTable isEditable={isEditable} />
				</div>
			),
			title: t("vocabulary.label"),
		},
	], [isEditable, t]);

	useEffect(() => {
		const path = searchParams.get(URL_PARAMETERS.view);
		if (!path) return;

		setInitialTabIndex(Math.max(viewTitles.findIndex((elem) => elem === path), 0));
	}, [searchParams, viewTitles]);

	const onTabsChange = useCallback((index: number) => {
		const nextView = viewTitles[index];
		if (!nextView) return;

		setSearchParams((prev) => {
			if (prev.get(URL_PARAMETERS.view) === nextView) {
				return (prev);
			}

			const next = new URLSearchParams(prev);
			next.set(URL_PARAMETERS.view, nextView);
			next.delete(URL_PARAMETERS.term);

			return (next);
		});
	}, [setSearchParams, viewTitles]);

	const tabs = useTabs({
		initialIndex: initialTabIndex,
		onChange: onTabsChange,
		views,
	});

	const headerNode = useMemo(() => (
		<div className="view-navigation">
			<div className="divider" />
			<div className="header-preparation-data">
				<PiFolderFill />
				{preparation.title === "" ? "New Preparation" : preparation.title}
			</div>
			<div className="divider" />
			<TabsBar items={tabs.items} />
		</div>
	), [preparation.title, tabs.items]);

	useEffect(() => {
		setViewNode(headerNode);
		
		return () => setViewNode(null);
	}, [setViewNode, headerNode]);

	return (
		<div
			className="preparation-tabs-view"
			ref={tabsViewRef}
		>
			<TabsPanels
				activeIndex={tabs.tabIndex}
				ids={tabs.ids}
				views={tabs.views}
			/>
		</div>
	);
};

export const PreparationLayout = ({ isNew = false, ...props }: PreparationLayoutProps) => (
	<PreparationWrapper
		editable={props.editable}
		isNew={isNew}
	>
		<FolderDropzone>
			<PreparationLayoutContent />
		</FolderDropzone>
	</PreparationWrapper>
);
