import { PropsWithChildren } from "react";

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
export const PreparationWrapper = ({ children, editable = false, savedPreparation }: PreparationWrapperProps) => (
    <PreparationProvider savedPreparation={savedPreparation}>
        <FoldersManagerProvider editable={editable}>
            <PreparationVocabularyProvider preparationVocabulary={groupVocabularyByColor(savedPreparation?.vocabulary)}>
                <PreparationWrapperChild>
                    {children}
                </PreparationWrapperChild>
            </PreparationVocabularyProvider>
        </FoldersManagerProvider>
    </PreparationProvider>
);
