import { useParams, useNavigate, useLocation } from "react-router";

import { DEFAULT_LOCALE } from "@/i18n/languages";

export const useLocale = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { locale } = useParams<{ locale: string }>();

    const currentLocale = locale ?? DEFAULT_LOCALE;

    const setLocale = (nextLocale: string) => {
        if (nextLocale === currentLocale) return;

        const newPath = location.pathname.replace(
            /^\/[^/]+/,
            `/${nextLocale}`
        );

        navigate(newPath + location.search);
    };

    return ({
        locale: currentLocale,
        setLocale,
    });
};
