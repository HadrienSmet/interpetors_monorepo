import { ReactNode } from "react";

import { Input, InputProps } from "../core";

import "./inputStyleLess.scss";

export const InputStyleLess = (props: InputProps): ReactNode => (
    <Input
        {...props}
        className={`${props.className ?? ""} style-less`}
    />
);
