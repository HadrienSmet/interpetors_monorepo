"use client"

import { ChangeEventHandler, useState } from "react";
import { MdOutlineExpandLess, MdOutlineExpandMore  } from "react-icons/md";

import "./select.scss";

type SelectOption = { 
    readonly value: string; 
    readonly label: string; 
};
type SelectProps = {
    readonly className?: string;
    readonly defaultValue?: string;
    readonly id?: string;
    readonly name: string;
    readonly options: Array<SelectOption>;
    readonly backgroundColor?: string;

    readonly onChange: ChangeEventHandler<HTMLSelectElement>;
};
export const Select = (props: SelectProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleBlur = () => setTimeout(() => setIsOpen(false), 100);
    const handleClick = () => setIsOpen(state => !state);

    return (
        <div className="select-container">
            <select
                className={props.className}
                defaultValue={props.defaultValue}
                id={props.id}
                name={props.name}
                onChange={props.onChange}
                onBlur={handleBlur}
                onClick={handleClick}
                style={{ backgroundColor: props.backgroundColor }}
            >
                {props.options.map((option, index) => (
                    <option key={`${option.value}-${index}`} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {isOpen 
                ? <MdOutlineExpandLess />
                : <MdOutlineExpandMore />
            }
        </div>
    );
};
