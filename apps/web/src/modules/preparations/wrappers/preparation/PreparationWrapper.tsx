import { PropsWithChildren, useMemo } from "react";

import { FoldersActionsProvider, FoldersManagerProvider } from "@/modules/folders";
import { PdfWrapper } from "@/modules/pdf";
import { groupVocabularyByColor, VocabularyWrapper } from "@/modules/vocabulary";

import { PreparationProvider, usePreparations } from "../../contexts";

type PreparationWrapperProps =
    & {
        readonly editable?: boolean;
		readonly isNew: boolean;
    }
    & PropsWithChildren;
export const PreparationWrapper = ({ children, editable = false, isNew }: PreparationWrapperProps) => {
	const { selectedPreparation } = usePreparations();

    const grouped = useMemo(() => (groupVocabularyByColor(selectedPreparation?.vocabulary)), [selectedPreparation?.vocabulary]);
 
    return (
		<FoldersActionsProvider>
            <VocabularyWrapper groupedVocabulary={grouped}>
                <PreparationProvider isNew={isNew}>
					<FoldersManagerProvider editable={editable}>
                        <PdfWrapper>
                            {children}
                        </PdfWrapper>
        			</FoldersManagerProvider>
                </PreparationProvider>
            </VocabularyWrapper>
        </FoldersActionsProvider>
    );
};
