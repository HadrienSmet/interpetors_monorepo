export type RgbColor = {
    readonly r: number;
    readonly g: number;
    readonly b: number;
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

    return { h, s: s * 100, l: l * 100 };
};
