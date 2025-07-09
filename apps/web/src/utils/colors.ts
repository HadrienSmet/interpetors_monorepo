const getRoundedValue = (num: string) => Math.max(Math.floor(Number(num)), 0);

/** Each value is included in 0-1 range */
export type RgbColor = {
    readonly r: number;
    readonly g: number;
    readonly b: number;
};
/** Each value is included in 0-255 range */
type SplittedRgb = {
    readonly r: number;
    readonly g: number;
    readonly b: number;
};
export const getRgbFromString = (color: string): SplittedRgb => {
    const [r, g, b] = color
        .split("(")[1]
        .split(")")[0]
        .split(",");

    return ({
        r: getRoundedValue(r),
        g: getRoundedValue(g),
        b: getRoundedValue(b),
    });
};
/** From PdfEditor rgb color (0 - 1) to regular rgb (0 - 255) */
export const getRgbColor = (color: RgbColor) => (
    `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`
);
export const getRoundedRgbColor = (color: RgbColor) => (
    `rgb(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)})`
);
export const getPdfRgbColor = (color: string) => {
    const { r, g, b } = getRgbFromString(color);

    return ({
        r: r/255,
        g: g/255,
        b: b/255,
    });
};
export const hslToRgb = (h: number, s: number, l: number): RgbColor => {
    s /= 100;
    l /= 100;

    const k = (n: number)  => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => (
        l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))
    );

    const r = f(0);
    const g = f(8);
    const b = f(4);

    return ({ r, g, b });
};

export const blendWithWhite = (rgb: string, alpha: number): string => {
    const matches = rgb.match(/\d+/g);
    if (!matches || matches.length < 3) return ("rgb(255, 255, 255)");

    const [r, g, b] = matches.map(Number);

    const blend = (channel: number) =>
        Math.round(channel * alpha + 255 * (1 - alpha));

    const newR = blend(r);
    const newG = blend(g);
    const newB = blend(b);

    return (`rgb(${newR}, ${newG}, ${newB})`);
};
export const rgbStringToHex = (rgb: string) => {
    const matches = rgb.match(/\d+/g);
    if (!matches || matches.length < 3) return ("FFFFFFFF");

    const toHex = (n: number) => n.toString(16).padStart(2, "0").toUpperCase();
    const [r, g, b] = matches.map(Number);

    return (`FF${toHex(r)}${toHex(g)}${toHex(b)}`);
};
export const rgbToHsl = ({ r, g, b }: RgbColor) => {
    const rNorm = r;
    const gNorm = g;
    const bNorm = b;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const delta = max - min;

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (delta !== 0) {
        s = delta / (1 - Math.abs(2 * l - 1));

        switch (max) {
            case rNorm:
                h = 60 * (((gNorm - bNorm) / delta) % 6);
                break;
            case gNorm:
                h = 60 * ((bNorm - rNorm) / delta + 2);
                break;
            case bNorm:
                h = 60 * ((rNorm - gNorm) / delta + 4);
                break;
        }

        if (h < 0) {
            h += 360;
        }
    }

    return ({ h, s: s * 100, l: l * 100 });
};
export const rgbToRgba = (color: RgbColor, opacity: number) => (
    `rgba(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)}, ${opacity})`
);
export const stringToRgba = (color: string, opacity: number) => {
    const pdfColor = getPdfRgbColor(color);

    return (rgbToRgba(pdfColor, opacity));
};
