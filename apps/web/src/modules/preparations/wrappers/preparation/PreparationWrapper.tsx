import { PropsWithChildren, useMemo } from "react";

import { FoldersManagerProvider } from "@/modules/folders";
import { groupVocabularyByColor, VocabularyWrapper } from "@/modules/vocabulary";

import { PreparationProvider } from "../../contexts";
import { SavedPreparation } from "../../types";


type PreparationWrapperProps =
    & {
        readonly editable?: boolean;
        readonly savedPreparation?: SavedPreparation;
    }
    & PropsWithChildren;
export const PreparationWrapper = ({ children, editable = false, savedPreparation }: PreparationWrapperProps) => {
    const preparation = useMemo(() => (savedPreparation), [savedPreparation]);
    const grouped = useMemo(() => (groupVocabularyByColor(savedPreparation?.vocabulary)), [savedPreparation?.vocabulary]);

    return (
        <FoldersManagerProvider
            editable={editable}
            savedFolders={preparation?.folders}
        >
            <VocabularyWrapper groupedVocabulary={grouped}>
                <PreparationProvider savedPreparation={preparation}>
                    {children}
                </PreparationProvider>
            </VocabularyWrapper>
        </FoldersManagerProvider>
    );
};
