import { ChangeEventHandler } from "react";
import { MdOutlineExpandMore  } from "react-icons/md";

import "./select.scss";

type SelectOption = {
    readonly value: string;
    readonly label: string;
};
type SelectProps = {
    readonly className?: string;
    readonly defaultValue?: string;
    readonly disabled?: boolean;
    readonly id?: string;
    readonly name: string;
    readonly options: Array<SelectOption>;
    readonly backgroundColor?: string;

    readonly onChange: ChangeEventHandler<HTMLSelectElement>;
};
export const Select = (props: SelectProps) => {
    return (
        <div className="select-container">
            <select
                className={props.className}
                defaultValue={props.defaultValue}
                disabled={props.disabled ?? false}
                id={props.id}
                name={props.name}
                onChange={props.onChange}
                style={{ backgroundColor: props.backgroundColor }}
            >
                {props.options.map((option, index) => (
                    <option
                        key={`${option.value}-${index}`}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
            <MdOutlineExpandMore />
        </div>
    );
};
