import { ChangeEvent, RefObject, useEffect, useMemo, useRef, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";

import { InputStyleLess, Tabs } from "@/components";
import { FOLDERS_TYPES, FoldersDisplayer, FolderDropzone, useFoldersManager } from "@/modules/folders";
import { VocabularyTable } from "@/modules/vocabulary";
import { URL_PARAMETERS } from "@/utils";

import { usePreparation } from "../../contexts";
import { SavedPreparation } from "../../types";
import { PreparationWrapper } from "../../wrappers";

import "./preparationLayout.scss";

type PreparationLayoutProps = {
    readonly backToList: () => void;
    readonly editable?: boolean;
    readonly preparation?: SavedPreparation | undefined;
    readonly scrollableParentRef?: RefObject<HTMLDivElement | null>;
};
type PreparationLayoutContentProps = Omit<PreparationLayoutProps, "preparation">;
const PreparationLayoutContent = (props: PreparationLayoutContentProps) => {
    const [initialTabIndex, setInitialTabIndex] = useState(0);

    const tabsViewRef = useRef<HTMLDivElement>(null);

    const { setFoldersStructure } = useFoldersManager();
    const { preparation, setTitle } = usePreparation();
    const [searchParams, setSearchParams] = useSearchParams();
    const { t } = useTranslation();

    const { title } = preparation;

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
                    <VocabularyTable />
                </div>
            ),
            title: t("vocabulary.label"),
        }
    ], []);
    const viewTitles = ["folders", "vocabulary"];

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
    const onTabsChange = (index: number) => {
        setSearchParams(prev => {
            if (props.scrollableParentRef?.current?.scrollLeft === 0) {
                // Not visible
                return (prev);
            }

            const next = new URLSearchParams(prev);
            next.set(URL_PARAMETERS.view, viewTitles[index]);

            return (next);
        });
    };

    useEffect(() => {
        if (preparation) {
            setFoldersStructure(preparation.folders);
        }
    }, [preparation]);
    useEffect(() => {
        const path = searchParams.get(URL_PARAMETERS.view);
        if (!path) return;

        setInitialTabIndex(Math.max(viewTitles.findIndex(elem => elem === path), 0));
    }, [searchParams.toString(), views]);

    return (
        <div
            className="preparation-tabs-view"
            ref={tabsViewRef}
        >
            <div className="preparation-header">
                <button
                    onClick={props.backToList}
                    title={t("preparations.backToList")}
                >
                    <MdArrowBack size={24} />
                </button>
                <InputStyleLess
                    onChange={onInputChange}
                    value={title}
                />
            </div>
            <Tabs
                initialIndex={initialTabIndex}
                onChange={onTabsChange}
                views={views}
            />
        </div>
    );
};

export const PreparationLayout = (props: PreparationLayoutProps) => (
    <PreparationWrapper
        editable={props.editable}
        savedPreparation={props.preparation}
    >
        <FolderDropzone>
            <PreparationLayoutContent {...props} />
        </FolderDropzone>
    </PreparationWrapper>
);
