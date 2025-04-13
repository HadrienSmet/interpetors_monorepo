import { MouseEventHandler } from "react";

import "./button.scss";

type ButtonProps = {
    readonly disabled?: boolean;
    readonly label: string;
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
            {props.label}
        </button>
    );
};
