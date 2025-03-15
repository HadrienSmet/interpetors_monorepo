import { PropsWithChildren, useEffect, useState } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";

import i18n from "@/i18n";
import { resources } from "@/i18n/resources";

import { LanguageContext } from "./LanguageContext";

const _LanguageProvider = (props: PropsWithChildren) => {
    const [lng, setLanguage] = useState("fr");
    const { i18n } = useTranslation();

    useEffect(() => {
        if (!(lng in resources)) throw new Error("Language not supported.")

        i18n.changeLanguage(lng);
    }, [lng]);

    return (
        <LanguageContext.Provider value={{ language: lng, setLanguage }}>
            {props.children}
        </LanguageContext.Provider>
    );
};

export const LanguageProvider = (props: PropsWithChildren) => (
    <I18nextProvider i18n={i18n}>
        <_LanguageProvider>
            {props.children}
        </_LanguageProvider>
    </I18nextProvider>
);
