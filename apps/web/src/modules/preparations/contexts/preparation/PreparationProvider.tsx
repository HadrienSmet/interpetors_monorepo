import { PropsWithChildren, useEffect, useState } from "react";

import { useFoldersManager } from "@/modules/folders";
import { useVocabulary } from "@/modules/vocabulary";

import { ClientPreparation, SavedPreparation } from "../../types";

import { PreparationContext } from "./PreparationContext";

export const DEFAULT_TITLE = "Default title";
type PreparationProviderProps =
    & PropsWithChildren
    & { readonly savedPreparation?: SavedPreparation; };
export const PreparationProvider = ({ children, savedPreparation }: PreparationProviderProps) => {
    const [title, setTitle] = useState("");

    const { foldersStructure } = useFoldersManager();
    const { groupedVocabulary } = useVocabulary();

    useEffect(() => {
        setTitle(savedPreparation?.title ?? DEFAULT_TITLE);
    }, [savedPreparation]);

    const preparation: ClientPreparation = {
        folders: foldersStructure,
        id: savedPreparation?.id ?? "",
        title,
        vocabulary: groupedVocabulary,
    };

    const value = {
        preparation,
        savedPreparation,
        setTitle,
    };

    return (
        <PreparationContext.Provider value={value}>
            {children}
        </PreparationContext.Provider>
    );
};
