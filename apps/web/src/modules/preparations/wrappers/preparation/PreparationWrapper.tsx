import { PropsWithChildren, useMemo } from "react";

import { FoldersManagerProvider } from "@/modules/folders";
import { groupVocabularyByColor, PreparationVocabularyProvider, usePreparationVocabulary, VocabularyTableProvider } from "@/modules/vocabulary";

import { PreparationProvider } from "../../contexts";
import { SavedPreparation } from "../../types";

const PreparationWrapperChild = ({ children }: PropsWithChildren) => {
    const { preparationVocabulary } = usePreparationVocabulary();

    return (
        <VocabularyTableProvider preparationVocabulary={preparationVocabulary}>
            {children}
        </VocabularyTableProvider>
    );
};

type PreparationWrapperProps =
    & {
        readonly editable?: boolean;
        readonly savedPreparation?: SavedPreparation;
    }
    & PropsWithChildren;
export const PreparationWrapper = ({ children, editable = false, savedPreparation }: PreparationWrapperProps) => {
    const preparation = useMemo(() => savedPreparation, [savedPreparation]);
    const preparationVocabulary = useMemo(() => (
        groupVocabularyByColor(savedPreparation?.vocabulary)
    ), [savedPreparation?.vocabulary]);

    return (
        <FoldersManagerProvider editable={editable}>
            <PreparationVocabularyProvider preparationVocabulary={preparationVocabulary}>
                <PreparationProvider savedPreparation={preparation}>
                    <PreparationWrapperChild>
                        {children}
                    </PreparationWrapperChild>
                </PreparationProvider>
            </PreparationVocabularyProvider>
        </FoldersManagerProvider>
    );
};
