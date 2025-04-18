import { useTranslation } from "react-i18next";

export const useLocale = () => {
    const { i18n } = useTranslation();

    return ({
        locale: i18n.language,
        setLocale: (lng: string) => {
            i18n.changeLanguage(lng);
        },
    });
};
