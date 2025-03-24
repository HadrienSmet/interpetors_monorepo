export const getCSSVariable = (variable: string) => {
    if (typeof window !== "undefined") {
        return (
            getComputedStyle(document.documentElement).getPropertyValue(variable)
        );
    }

    return (null);
};
