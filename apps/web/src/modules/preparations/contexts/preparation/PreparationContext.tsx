import { createContext, Dispatch, SetStateAction, useContext } from "react";

import { getContextError } from "@/contexts/utils";

import { ClientPreparation, SavedPreparation } from "../../types";

type PreparationContextValue = {
    readonly savedPreparation: SavedPreparation | undefined;
    readonly preparation: ClientPreparation;
    readonly setTitle: Dispatch<SetStateAction<string>>;
};

export const PreparationContext = createContext<PreparationContextValue | null>(null);

export const usePreparation = () => {
    const ctx = useContext(PreparationContext);

    if (!ctx) {
        throw new Error(getContextError("usePreparation", "PreparationProvider"));
    }

    return (ctx);
};
