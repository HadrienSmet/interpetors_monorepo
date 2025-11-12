import { createContext, Dispatch, SetStateAction, useContext } from "react";

import { getContextError } from "@/contexts/utils";

import { SavedPreparation } from "../../types";

type PreparationContextValue = {
    readonly savedPreparation: SavedPreparation | undefined;
    readonly setTitle: Dispatch<SetStateAction<string>>;
    readonly title: string;
};

export const PreparationContext = createContext<PreparationContextValue | null>(null);

export const usePreparation = () => {
    const ctx = useContext(PreparationContext);

    if (!ctx) {
        throw new Error(getContextError("usePreparation", "PreparationProvider"));
    }

    return (ctx);
};
