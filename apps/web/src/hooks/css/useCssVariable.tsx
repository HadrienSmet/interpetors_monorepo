import { useMemo } from "react";

import { useTheme } from "@/contexts";

export const useCssVariable = (variable: string) => {
    const { theme } = useTheme();

    const cssVariable = useMemo(
        () => getComputedStyle(document.documentElement).getPropertyValue(variable),
        [theme, variable]
    );

    return (cssVariable);
};
