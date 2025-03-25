import { MouseEventHandler } from "react";

import "./toggler.scss";

type TogglerProps = {
    readonly containerWidth: number;
    readonly className?: string;
    readonly isActive: boolean;
    readonly onClick: MouseEventHandler<HTMLButtonElement>;
};
export const Toggler = (props: TogglerProps) => {
    return (
        <button 
            className={`toggler ${props.className}`}
            style={{
                height: props.containerWidth/2,
                width: props.containerWidth,
            }}
            onClick={props.onClick} 
        >
            <i 
                className="toggler__indicator"
                style={{
                    height: props.containerWidth/2,
                    width: props.containerWidth/2,
                    left: props.isActive 
                        ? (props.containerWidth/2) * 0.97
                        : 0
                }}
            />
        </button>
    );
};
