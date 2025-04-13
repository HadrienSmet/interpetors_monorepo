import { ChangeEventHandler } from "react";

type InputProps = {
    readonly backgroundColor?: string;
    readonly className?: string;
    readonly disabled?: boolean;
    readonly id?: string;
    readonly name: string;
    readonly onChange: ChangeEventHandler<HTMLInputElement>;
    readonly placeholder: string;
};
export const Input = (props: InputProps): JSX.Element => {
    return (
        <input
            className={`${props.className} input`}
            disabled={props.disabled}
            id={props.id}
            name={props.name}
            onChange={props.onChange}
            placeholder={props.placeholder}
            style={{ backgroundColor: props.backgroundColor }}
        />
    );
};
