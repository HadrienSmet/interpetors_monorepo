import { ChangeEvent, RefObject, useEffect, useMemo, useRef, useState } from "react";
import { MdArrowBack, MdSave } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";

import { FilesActionsStore, FolderStructure, SavedVocabularyTerm } from "@repo/types";

import { Button, InputStyleLess, Loader, Tabs } from "@/components";
import { FOLDERS_TYPES, FoldersDisplayer, FolderDropzone, useFoldersManager, useFoldersActions } from "@/modules/folders";
import { useVocabularyTable, VocabularyTable } from "@/modules/vocabulary";
import { URL_PARAMETERS } from "@/utils";

import { usePreparation } from "../../contexts";
import { SavedPreparation } from "../../types";
import { PreparationWrapper } from "../../wrappers";

import "./preparationLayout.scss";

export type SavePreparationParams = {
    readonly folders: Array<FolderStructure>;
    readonly foldersActions: FilesActionsStore;
    readonly old?: SavedPreparation;
    readonly rootFolderId?: string;
    readonly title: string;
    readonly vocabularyTerms: Array<SavedVocabularyTerm>;
};
type PreparationLayoutProps = {
    readonly backToList: () => void;
    readonly editable?: boolean;
    readonly preparation?: SavedPreparation | undefined;
    readonly savePreparation: (params: SavePreparationParams) => Promise<void>;
    readonly scrollableParentRef?: RefObject<HTMLDivElement | null>;
};
type PreparationLayoutContentProps = Omit<PreparationLayoutProps, "preparation">;
const PreparationLayoutContent = (props: PreparationLayoutContentProps) => {
    const [initialTabIndex, setInitialTabIndex] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    const tabsViewRef = useRef<HTMLDivElement>(null);

    const { foldersActions } = useFoldersActions();
    const { foldersStructure, setFoldersStructure } = useFoldersManager();
    const { preparation, savedPreparation, setTitle } = usePreparation();
    const [searchParams, setSearchParams] = useSearchParams();
    const { t } = useTranslation();
    const { list: vocabularyTerms } = useVocabularyTable();

    const { title } = preparation;

    const views = useMemo(() => [
        {
            content: (
                <div className="preparation-folders">
                    <FoldersDisplayer type={FOLDERS_TYPES.UNEDITABLE} />
                </div>
            ),
            title: "folders",
        },
        {
            content: (
                <div className="preparation-vocabulary">
                    <VocabularyTable />
                </div>
            ),
            title: "vocabulary",
        }
    ], []);
    const viewTitles = views.map(v => String(v.title));

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
    const onSave = async () => {
        setIsSaving(true);

        await props.savePreparation({
            folders: foldersStructure,
            foldersActions,
            old: savedPreparation,
            title,
            vocabularyTerms,
        });

        setIsSaving(false);
    };
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

        setInitialTabIndex(Math.max(views.findIndex(elem => elem.title === path), 0));
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
                    value={title}
                    onChange={onInputChange}
                />
                <Button
                    disabled={title === "" || foldersStructure.length === 0 || isSaving}
                    onClick={onSave}
                >
                    {isSaving
                        ? (<Loader size="small" theme="disabled" />)
                        : (
                            <>
                                <MdSave />
                                <p>{t("preparations.save")}</p>
                            </>
                        )
                    }
                </Button>
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
