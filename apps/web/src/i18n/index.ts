import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { SUPPORTED_LANGUAGES } from "./translations";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        resources: {
            en: SUPPORTED_LANGUAGES.en,
            fr: SUPPORTED_LANGUAGES.fr,
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
