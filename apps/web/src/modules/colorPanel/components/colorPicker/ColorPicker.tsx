import { useState, useRef, useEffect, useMemo } from "react";

import { RgbColor } from "@repo/types";

import { hslToRgb, rgbToHsl, getRgbColor } from "@/utils";

import { ColorSwatch } from "../../types";

import { ColorPropositions } from "./colorPropositions";
import "./colorPicker.scss";

type CommonProps = {
    readonly color: RgbColor;
    readonly handlePickerColor: (color: RgbColor) => void;
    readonly height: number;
    readonly isLandscape?: boolean;
    readonly onSelection?: () => void;
    readonly width: number;
};
type ColorPickerWithoutPropositions = {
    readonly displayPropositions?: false;
    readonly handlePropositionColor?: undefined;
};
type ColorPickerWithPropositions = {
    readonly displayPropositions: true;
    readonly handlePropositionColor: (colorSwatch: ColorSwatch) => void;
};
type ColorPickerProps =
    & CommonProps
    & (
        ColorPickerWithPropositions |
        ColorPickerWithoutPropositions
    )
export const ColorPicker = ({
    color,
    displayPropositions = false,
    handlePickerColor,
    handlePropositionColor,
    height,
    isLandscape = false,
    onSelection,
    width,
}: ColorPickerProps) => {
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

    const pickerRef = useRef<HTMLDivElement | null>(null);

    const cursorBg = useMemo(() => getRgbColor(color), [color]);

    const handleMouseMove = (event: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
        if (!pickerRef.current) {
            return;
        }

        const { left, top } = pickerRef.current.getBoundingClientRect();
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

        handlePickerColor(rgb);
    };

    const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        handleMouseMove(event);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", handleMouseMove);
        }, { once: true });
    };

    useEffect(() => {
        const { h, l } = rgbToHsl(color);

        const x = (h * width) / 360;
        const y = ((100 - l) / 100) * height;

        setCursorPosition({ x, y });
    }, [color, width, height]);

    return (
        <div
            className="color-picker-division"
            style={{
                flexDirection: isLandscape
                    ? "column"
                    : "row"
            }}
        >
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
            {displayPropositions && (
                <ColorPropositions
                    isLandscape={isLandscape}
                    onSelection={onSelection}
                    handleProposition={handlePropositionColor!}
                />
            )}
        </div>
    );
};
