import { useEffect, useMemo } from "react";
import { MdArrowBack } from "react-icons/md";

import { Loader, Tabs } from "@/components";
import { FOLDERS_TYPES, NewFoldersDisplayer, FoldersManagerProvider, useFoldersManager } from "@/modules/folders";
import { groupVocabularyByColor, PreparationVocabularyProvider, VocabularyTable, VocabularyTableProvider } from "@/modules/vocabulary";

import { usePreparations } from "../../contexts";

import "./preparationLayout.scss";

type PreparationLayoutProps = {
    readonly backToList: () => void;
};
const PreparationLayoutChild = ({ backToList }: PreparationLayoutProps) => {
    const { setFoldersStructure } = useFoldersManager();
    const { selectedPreparation, preparations } = usePreparations();

    // TODO Allow to add translation on old preparation
    const addTranslation = (params: any) => console.log(params);

    const preparation = useMemo(() => {
        if (!selectedPreparation || !preparations) return;

        return (preparations.find(prep => prep.id === selectedPreparation));
    }, [selectedPreparation, preparations]);

    useEffect(() => {
        if (preparation) {
            setFoldersStructure(preparation.folders);
        }
    }, [selectedPreparation, preparations]);

    if (!preparation) {
        return (<Loader />);
    }

    return (
        <div className="preparation-tabs-view">
            <button onClick={backToList}>
                <MdArrowBack size={24} />
            </button>
            <Tabs views={[
                {
                    title: "folders",
                    content: (
                        <div className="preparation-folders">
                            <NewFoldersDisplayer type={FOLDERS_TYPES.UNEDITABLE} />
                        </div>
                    )
                },
                {
                    title: "vocabulary",
                    content: (
                        <VocabularyTableProvider preparationVocabulary={groupVocabularyByColor(preparation.vocabulary)}>
                            <div className="preparation-vocabulary">
                                <VocabularyTable addTranslation={addTranslation} />
                            </div>
                        </VocabularyTableProvider>
                    )
                }
            ]} />
        </div>
    );
};

export const PreparationLayout = (props: PreparationLayoutProps) => (
    <FoldersManagerProvider>
        <PreparationVocabularyProvider>
            <PreparationLayoutChild {...props} />
        </PreparationVocabularyProvider>
    </FoldersManagerProvider>
);
