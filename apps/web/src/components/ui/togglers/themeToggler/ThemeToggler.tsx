"use client"

import { useMemo } from "react";

import { THEME, useTheme } from "@/contexts";

import { Toggler } from "../core/Toggler";

type ThemeTogglerProps = {
    readonly containerWidth: number;
};
export const ThemeToggler = (props: ThemeTogglerProps) => {
    const { theme, toggleTheme } = useTheme();
    
    const isActive = useMemo(() => theme === THEME.LIGHT, [theme]);
    
    return (
        <Toggler
            {...props}
            isActive={isActive}
            onClick={toggleTheme}
        />
    );
};
