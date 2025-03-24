"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";

import { TranslationContext } from "@/contexts";
import { getTranslation } from "@/i18n";

const STORAGE_KEY = "locale";

export const TranslationProvider = (props: PropsWithChildren) => {
    const [t, setT] = useState<((key: string) => string) | null>(null);

    const params = useParams();
    const pathname = usePathname();
    const router = useRouter();
    
    const locale = params?.locale as string;

    const updatePathname = (newLocale: string) => {
        const segments = pathname.split("/");
        const localeIndex = segments.indexOf(locale);

        if (localeIndex !== -1) {
            segments[localeIndex] = newLocale;
        }

        return (segments.join("/"));
    };
    const switchLocale = (newLocale: string) => {
        const updatedPathname = updatePathname(newLocale);
        
        localStorage.setItem(STORAGE_KEY, newLocale);
        router.push(updatedPathname);
    };

    // On mount: Checks if the locale match with the one in local storage
    // If not match redirect to the right translation
    useEffect(() => {
        const storedLocale = localStorage.getItem(STORAGE_KEY);

        if (storedLocale && storedLocale !== locale) {
            const updatedPathname = updatePathname(storedLocale);

            router.push(updatedPathname);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handles the t function any time the locale changes
    useEffect(() => {
        if (!locale) return;

        getTranslation(locale).then((tFunction) => {
            setT(() => tFunction);
        });
    }, [locale]);

    if (!t) {
        // Need to use real loader
        return (<p>Loading...</p>)
    }

    return (
        <TranslationContext.Provider value={{ locale, switchLocale, t }}>
            {props.children}
        </TranslationContext.Provider>
    );
};
