import { en, fr } from "./translations";

export const SUPPORTED_LOCALES = {
    en: "en",
    fr: "fr"
} as const;
export const SUPPORTED_LANGUAGES = {
    [SUPPORTED_LOCALES.en]: en,
    [SUPPORTED_LOCALES.fr]: fr,
};
// i18n/locales.ts
export type Locale = typeof SUPPORTED_LOCALES[keyof typeof SUPPORTED_LOCALES];

export const DEFAULT_LOCALE: Locale = SUPPORTED_LOCALES.en;
