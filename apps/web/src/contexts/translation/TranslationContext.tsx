"use client"
import { createContext, useContext } from "react";

import { getContextError } from "../errorMessage";

export type TranslationContextType = {
    readonly locale: string;
    readonly switchLocale: (locale: string) => void;
    readonly t: (key: string) => string;
};
export const TranslationContext = createContext<TranslationContextType | null>(null);

export const useTranslation = () => {
    const context = useContext(TranslationContext);

    if (!context) {
        throw new Error(getContextError("useTranslation", "TranslationProvider"));
    }

    return (context);
};
