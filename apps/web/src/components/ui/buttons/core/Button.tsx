import { MouseEventHandler, ReactNode } from "react";

import "./button.scss";

type ButtonProps = {
    readonly children?: ReactNode;
    readonly disabled?: boolean;
    readonly label?: string;
    readonly onClick: MouseEventHandler<HTMLButtonElement>;
};
export const Button = (props: ButtonProps) => {
    const { disabled = false } = props;

    return (
        <button
            className="button"
            disabled={disabled}
            onClick={props.onClick}
        >
            {props.children ?? props.label}
        </button>
    );
};
