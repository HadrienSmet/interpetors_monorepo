import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

import { Input, InputProps } from "../core";

import "./secureInput.scss";

export const SecureInput = (props: InputProps) => {
    const [hidden, setHidden] = useState(true);

    const toggleVisibility = () => setHidden(state => !state);

    return (
        <div className="secure-input">
            <Input
                {...props}
                type={hidden ? "password" : "text"}
            />
            <button onClick={toggleVisibility}>
                {hidden
                    ? <FaRegEye />
                    : <FaRegEyeSlash />
                }
            </button>
        </div>
    );
};
