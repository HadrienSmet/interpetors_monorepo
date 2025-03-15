import { createContext, Dispatch, SetStateAction, useContext } from "react";

import { getContextError } from "../messageError";

type LanguageContextType = {
    readonly language: string;
    readonly setLanguage: Dispatch<SetStateAction<string>>;
};

export const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
    const context = useContext(LanguageContext);

    if (context == null) throw new Error(getContextError("useLanguage", "LanguageProvider"));

    return (context);
};
