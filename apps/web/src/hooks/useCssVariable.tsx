import { useTheme } from "@/contexts";
import { useMemo } from "react";

export const useCssVariable = (variable: string) => {
    const { theme } = useTheme();

    const cssVariable = useMemo(
        () => getComputedStyle(document.documentElement).getPropertyValue(variable), 
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [theme, variable]
    );

    return (cssVariable);
    // if (typeof window !== "undefined") {
    //     return (
    //         getComputedStyle(document.documentElement).getPropertyValue(variable)
    //     );
    // }

    // return (null);
};