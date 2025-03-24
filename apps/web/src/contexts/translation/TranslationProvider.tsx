"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";

import { TranslationContext } from "@/contexts";
import { getTranslation } from "@/i18n";

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
        
        router.push(updatedPathname);
    };

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
