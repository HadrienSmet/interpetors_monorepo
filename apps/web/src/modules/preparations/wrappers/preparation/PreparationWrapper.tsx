import { PropsWithChildren, useMemo } from "react";

import { FoldersActionsProvider, FoldersManagerProvider } from "@/modules/folders";
import { PdfWrapper } from "@/modules/pdf";
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
    const grouped = useMemo(() => (groupVocabularyByColor(savedPreparation?.vocabulary)), [savedPreparation?.vocabulary]);
 
    return (
        <FoldersManagerProvider
            editable={editable}
            savedFolders={savedPreparation?.folders}
        >
            <FoldersActionsProvider savedActions={savedPreparation?.foldersActions}>
                    <VocabularyWrapper groupedVocabulary={grouped}>
                        <PreparationProvider savedPreparation={savedPreparation}>
                            <PdfWrapper>
                                {children}
                            </PdfWrapper>
                        </PreparationProvider>
                    </VocabularyWrapper>
            </FoldersActionsProvider>
        </FoldersManagerProvider>
    );
};
