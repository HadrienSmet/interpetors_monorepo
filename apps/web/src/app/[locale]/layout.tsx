import { PropsWithChildren } from "react";

import { TranslationProvider } from "@/contexts";

export default function LocaleLayout(props: PropsWithChildren) {
    return (
        <TranslationProvider>
            {props.children}
        </TranslationProvider>
    );
}
