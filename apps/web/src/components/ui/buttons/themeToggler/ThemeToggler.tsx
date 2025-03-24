"use client"

import { useMemo } from "react";

import { THEME, useTheme } from "@/contexts";

import "./themeToggler.scss";

type ThemeTogglerProps = {
    readonly containerWidth: number;
};
export const ThemeToggler = (props: ThemeTogglerProps) => {
    const { theme, toggleTheme } = useTheme();

    const isActive = useMemo(() => theme === THEME.LIGHT, [theme]);

    return (
        <button 
            className={`theme-toggler ${isActive && "active"}`}
            style={{
                height: props.containerWidth/2,
                width: props.containerWidth,
            }}
            onClick={toggleTheme} 
        >
            <i 
                className="theme-toggler__indicator"
                style={{
                    height: props.containerWidth/2,
                    width: props.containerWidth/2,
                    left: isActive 
                        ? (props.containerWidth/2) * 0.97
                        : 0
                }}
            />
        </button>
    );
};
