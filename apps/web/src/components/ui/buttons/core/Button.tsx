import { MouseEventHandler, ReactNode } from "react";

import { Loader } from "../../loader";

import "./button.scss";

type ButtonProps = {
    readonly children?: ReactNode;
    readonly disabled?: boolean;
    readonly isPending?: boolean;
    readonly label?: string;
    readonly onClick: MouseEventHandler<HTMLButtonElement>;
};
export const Button = ({
    disabled = false,
    isPending = false,
    ...props
}: ButtonProps) => (
    <button
        className="button"
        disabled={disabled || isPending}
        onClick={props.onClick}
    >
        {isPending
            ? (<Loader size="small" theme="disabled" />)
            : props.children ?? props.label
        }
    </button>
);
