import { ReactNode, useEffect, useState } from "react";

import { useLocale } from "@/hooks";

import { InputProps } from "./input.types";

import "./inputStyleLess.scss";

export const InputStyleLess = (props: InputProps): ReactNode => {
    const [placeholder, setPlaceholder] = useState(props.placeholder || "");
    const { locale } = useLocale();

    const handleFocus = () => setPlaceholder("");
    const handleBlur = () => setPlaceholder(props.placeholder || "");

    useEffect(() => { // Re-render with right placeholders whenever locale changes
        handleBlur();
    }, [locale])

    return (
        <input
            className={`${props.className} style-less`}
            disabled={props.disabled}
            id={props.id}
            name={props.name}
            onBlur={handleBlur}
            onChange={props.onChange}
            onFocus={handleFocus}
            placeholder={placeholder}
            style={props.style}
        />
    );
};
