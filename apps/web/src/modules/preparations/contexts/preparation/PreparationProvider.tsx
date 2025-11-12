import { PropsWithChildren, useEffect, useState } from "react";

import { SavedPreparation } from "../../types";

import { PreparationContext } from "./PreparationContext";

export const DEFAULT_TITLE = "Default title";
type PreparationProviderProps =
    & PropsWithChildren
    & { readonly savedPreparation?: SavedPreparation; };
export const PreparationProvider = ({ children, savedPreparation }: PreparationProviderProps) => {
    const [title, setTitle] = useState("");

    useEffect(() => {
        setTitle(savedPreparation?.title ?? DEFAULT_TITLE);
    }, [savedPreparation?.title]);

    const value = {
        savedPreparation,
        setTitle,
        title,
    };

    return (
        <PreparationContext.Provider value={value}>
            {children}
        </PreparationContext.Provider>
    );
};
