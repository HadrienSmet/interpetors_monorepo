import { ChangeEventHandler, CSSProperties } from "react";

export type InputProps = {
    readonly className?: string;
    readonly disabled?: boolean;
    readonly id?: string;
    readonly name: string;
    readonly onChange: ChangeEventHandler<HTMLInputElement>;
    readonly placeholder: string;
    readonly style?: CSSProperties;
};
