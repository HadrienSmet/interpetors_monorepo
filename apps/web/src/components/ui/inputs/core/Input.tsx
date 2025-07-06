import { FocusEvent, ReactNode, useEffect, useState } from "react";

import { useLocale } from "@/hooks";

import { InputProps } from "./input.types";

export const Input = (props: InputProps): ReactNode => {
    const [placeholder, setPlaceholder] = useState(props.placeholder || "");
    const { locale } = useLocale();

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
        setPlaceholder("");
        if (props.onFocus) props.onFocus(e);
    };
    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        setPlaceholder(props.placeholder || "");
        if (props.onBlur) props.onBlur(e);
    };

    useEffect(() => { // Re-render with right placeholders whenever locale changes
        setPlaceholder(props.placeholder || "");
    }, [locale])

    return (
        <input
        {...props}
            className={`${props.className ?? ""}`}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder={placeholder}
        />
    );
};
