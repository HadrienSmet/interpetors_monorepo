import { createContext, useContext } from "react";

import { getContextError } from "../utils";

export const THEME = {
    LIGHT: "light",
    DARK: "dark",
} as const;

export type Theme = typeof THEME[keyof typeof THEME];
type ThemeContextType = {
    readonly theme: Theme;
    readonly toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(getContextError("useTheme", "ThemeProvider"));
    }

    return (context);
};
