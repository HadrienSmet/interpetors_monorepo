import { ChangeEventHandler, CSSProperties } from "react";
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
    readonly style?: CSSProperties;

    readonly onChange: ChangeEventHandler<HTMLSelectElement>;
};
export const Select = (props: SelectProps) => {
    return (
        <div className="select-container">
            <select
                className={`${props.className} input`}
                defaultValue={props.defaultValue}
                disabled={props.disabled ?? false}
                id={props.id}
                name={props.name}
                onChange={props.onChange}
                style={props.style}
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
