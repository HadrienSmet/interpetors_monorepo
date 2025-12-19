import { useEffect } from "react";
import { Outlet, Navigate, useParams } from "react-router";

import i18n from "@/i18n";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/i18n/languages";

export const LocaleLayout = () => {
    const { locale } = useParams<{ locale: string }>();

    if (!locale || !Object.values(SUPPORTED_LOCALES).includes(locale as any)) {
        return (<Navigate to={`/${DEFAULT_LOCALE}`} replace />);
    }

    useEffect(() => {
        if (i18n.language !== locale) {
            i18n.changeLanguage(locale);
        }
    }, [locale]);

    return (<Outlet />);
};
