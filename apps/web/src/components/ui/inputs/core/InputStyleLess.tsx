import { ReactNode, useState } from "react";

import { InputProps } from "./input.types";

import "./inputStyleLess.scss";

export const InputStyleLess = (props: InputProps): ReactNode => {
    const [placeholder, setPlaceholder] = useState(props.placeholder || "");

    const handleFocus = () => setPlaceholder("");
    const handleBlur = () => setPlaceholder(props.placeholder || "");

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
