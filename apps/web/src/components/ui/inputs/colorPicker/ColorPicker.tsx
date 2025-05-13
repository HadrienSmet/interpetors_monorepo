import { useState, useRef, useEffect, useMemo } from "react";

import { hslToRgb, RgbColor, rgbToHsl } from "./utils";
import "./colorPicker.scss";

type ColorPickerProps = {
    readonly color: RgbColor;
    readonly height: number;
    readonly setColor: (color: RgbColor) => void;
    readonly width: number;
};
export const ColorPicker = ({ color, height, setColor, width }: ColorPickerProps) => {
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

    const pickerRef = useRef<HTMLDivElement | null>(null);

    const cursorBg = useMemo(() => `rgb(${color.r, color.g, color.b})`, [color]);

    const handleMouseMove = (event: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
        if (!pickerRef.current) {
            return;
        }

        const { left, top, width, height } = pickerRef.current.getBoundingClientRect();
        let x = event.clientX - left;
        let y = event.clientY - top;

        // Constrain within bounds
        x = Math.max(0, Math.min(width, x));
        y = Math.max(0, Math.min(height, y));

        setCursorPosition({ x, y });

        // Calculate color based on position
        const h = (x / width) * 360;
        const s = 100;
        const l = 100 - (y / height) * 100;

        const rgb = hslToRgb(h, s, l);

        setColor(rgb);
    };

    const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        handleMouseMove(event);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", handleMouseMove);
        }, { once: true });
    };

    useEffect(() => {
        if (!pickerRef.current) return;

        const { width, height } = pickerRef.current.getBoundingClientRect();
        const { h, l } = rgbToHsl(color);

        const x = (h / 360) * width;
        const y = ((100 - l) / 100) * height;

        setCursorPosition({ x, y });
    }, [color]);

    return (
        <div
            className="color-picker"
            ref={pickerRef}
            onMouseDown={onMouseDown}
            style={{ height, width }}
        >
            <div
                className="color-picker-cursor"
                style={{
                    backgroundColor: cursorBg,
                    left: cursorPosition.x,
                    top: cursorPosition.y,
                }}
            />
        </div>
    );
};
