import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { DEFAULT_LOCALE, SUPPORTED_LANGUAGES } from "./languages";

i18n
    .use(initReactI18next)
    .init({
        lng: DEFAULT_LOCALE,
        fallbackLng: DEFAULT_LOCALE,
        resources: {
            en: SUPPORTED_LANGUAGES.en,
            fr: SUPPORTED_LANGUAGES.fr,
        },
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });

export default i18n;
