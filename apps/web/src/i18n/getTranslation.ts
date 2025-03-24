import i18next from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";

import { defaultLang } from "@/i18n/settings";

export const getTranslation = async (locale: string) => {
    const i18nInstance = i18next.createInstance();

    await i18nInstance
        .use(initReactI18next)
        .use(resourcesToBackend((lng: string) => import(`@/i18n/locales/${lng}/translation.json`)))
        .init({
            lng: locale,
            fallbackLng: defaultLang,
            ns: ["common"],
            defaultNS: "common",
        });

    return (i18nInstance.t);
};
