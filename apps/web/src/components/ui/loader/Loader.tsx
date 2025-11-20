import { useEffect, useRef } from "react";

import "./loader.scss";

export const LoaderSizes = {
    fullScreen: 200,
    medium: 80,
    small: 24,
} as const;
const LoaderThemes = {
    disabled: "disabled",
    onBackground: "onBackground",
    regular: "regular",
} as const;

type LoaderProps = {
    readonly size?: keyof typeof LoaderSizes;
    readonly theme?: keyof typeof LoaderThemes;
};
export const Loader = ({ size = "medium", theme = LoaderThemes.regular }: LoaderProps) => {
    const loaderRef = useRef<HTMLDivElement>(null);

    const style = { maxWidth: LoaderSizes[size] };

    useEffect(() => {
        if (!loaderRef.current) {
            return;
        }
        loaderRef.current.style.setProperty("--loader-width", `${LoaderSizes[size]}px`);
    }, [size]);

    return (
        <div className="loader-container">
            <div
                className={`loader ${theme}`}
                ref={loaderRef}
                style={style}
            />
        </div>
    );
};
