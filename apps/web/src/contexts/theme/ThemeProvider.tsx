import { PropsWithChildren, useEffect, useState } from "react";

import { THEME, Theme, ThemeContext } from "./ThemeContext";

const DOCUMENT_ATTRIBUTE = "data-theme";
const STORAGE_KEY = "theme";

export const ThemeProvider = (props: PropsWithChildren) => {
    const [theme, setTheme] = useState<Theme>(THEME.LIGHT);

    useEffect(() => {
        const storedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;

        if (storedTheme) {
            setTheme(storedTheme);
            document.documentElement.setAttribute(DOCUMENT_ATTRIBUTE, storedTheme);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === THEME.LIGHT
            ? THEME.DARK
            : THEME.LIGHT;

        setTheme(newTheme);
        localStorage.setItem(STORAGE_KEY, newTheme);
        document.documentElement.setAttribute(DOCUMENT_ATTRIBUTE, newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {props.children}
        </ThemeContext.Provider>
    );
};
