import { PropsWithChildren, useEffect, useState } from "react";

import { useFoldersManager } from "@/modules/folders";
import { usePreparationVocabulary } from "@/modules/vocabulary";

import { ClientPreparation, SavedPreparation } from "../../types";

import { PreparationContext } from "./PreparationContext";

export const DEFAULT_TITLE = "Default title";
type PreparationProviderProps =
    & PropsWithChildren
    & { readonly savedPreparation?: SavedPreparation; };
export const PreparationProvider = ({ children, savedPreparation }: PreparationProviderProps) => {
    const [title, setTitle] = useState("");

    const { foldersStructure } = useFoldersManager();
    const { preparationVocabulary } = usePreparationVocabulary();

    useEffect(() => {
        setTitle(savedPreparation?.title ?? DEFAULT_TITLE);
    }, [savedPreparation]);

    const preparation: ClientPreparation = {
        id: savedPreparation?.id ?? "",
        title,
        folders: foldersStructure,
        vocabulary: preparationVocabulary,
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
