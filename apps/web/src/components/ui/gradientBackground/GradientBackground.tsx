import { ReactNode, useEffect, useRef, useState } from "react";

import { rgbToRgba } from "@/utils";

import "./gradientBackground.scss";

type GradientBackgroundProps = { readonly color: string };
export const GradientBackground = ({ color }: GradientBackgroundProps) => {
    const [gradients, setGradients] = useState<Array<ReactNode>>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const numberOfGradients = Math.ceil(Math.random() * 4) + 2;
        const minimal = 55;
        const randomness = 30;

        const width = containerRef.current.getBoundingClientRect().width;

        const newGradients: ReactNode[] = [];

        for (let i = 0; i < numberOfGradients; i++) {
            const left = Math.floor((Math.random() * 100) - 10);
            const top = Math.floor((Math.random() * 100) - 30);
            const gradientSize = Math.ceil(((Math.random() * randomness) + minimal)) / Math.ceil(numberOfGradients * 0.35);
            const opacity = Number(((Math.random() * 0.3) + 0.6).toFixed(1));
            const background = `radial-gradient(circle at center, ${rgbToRgba(color, opacity)} 0, ${rgbToRgba(color, 0)} 50%) no-repeat`;

            const size = width * (gradientSize / 100);

            const style = {
                left: `calc(${left}% - ${size/2}px)`,
                top: `calc(${top}% - ${size/2}px)`,
                width: size,
                height: size,
                background,
                position: "absolute",
            } as const;

            newGradients.push(
                <div key={`gradient-${i}`} className="gradient" style={style} />
            );
        }

        setGradients(newGradients);
    }, [color]);

    return (
        <div
            className="gradient-background"
            ref={containerRef}
            style={{
                background: `linear-gradient(40deg, ${rgbToRgba(color, 0.3)}, ${rgbToRgba(color, 0.1)})`,
            }}
        >
            <div className="gradient-container">
                {containerRef.current ? gradients : "null"}
            </div>
            <div className="gradient-filter" />
        </div>
    );
};
