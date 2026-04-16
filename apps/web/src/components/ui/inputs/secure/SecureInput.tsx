import { useState } from "react";
import { PiEye, PiEyeSlash } from "react-icons/pi";

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
                    ? <PiEye />
                    : <PiEyeSlash />
                }
            </button>
        </div>
    );
};
