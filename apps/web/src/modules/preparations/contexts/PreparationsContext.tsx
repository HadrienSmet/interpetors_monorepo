import { createContext, Dispatch, SetStateAction, useContext } from "react";

import { getContextError } from "@/contexts/utils";

import { SavedPreparation } from "../types";

export type PreparationsContextValue = {
    readonly isLoading: boolean;
    readonly preparations: Array<SavedPreparation> | null;
    readonly selectedPreparation: string | undefined;
    readonly setSelectedPreparation: Dispatch<SetStateAction<string | undefined>>;
};
export const PreparationsContext = createContext<PreparationsContextValue | null>(null);

export const usePreparations = () => {
    const ctx = useContext(PreparationsContext);

    if (!ctx) {
        throw new Error(getContextError("usePreparations", "PreparationsProvider"));
    }

    return (ctx);
};
