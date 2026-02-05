import { PropsWithChildren, useEffect, useState } from "react";

import { LOCAL_STORAGE } from "@/utils";

import { THEME, Theme, ThemeContext } from "./ThemeContext";

const DOCUMENT_ATTRIBUTE = "data-theme";

export const ThemeProvider = (props: PropsWithChildren) => {
    const [theme, setTheme] = useState<Theme>(THEME.LIGHT);

    useEffect(() => {
        const storedTheme = localStorage.getItem(LOCAL_STORAGE.theme) as Theme | null;

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
        localStorage.setItem(LOCAL_STORAGE.theme, newTheme);
        document.documentElement.setAttribute(DOCUMENT_ATTRIBUTE, newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {props.children}
        </ThemeContext.Provider>
    );
};
