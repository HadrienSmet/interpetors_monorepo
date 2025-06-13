export const findPointPage = (ref: HTMLCanvasElement | undefined, points: Array<{ readonly y: number; }>) => {
    if (!ref) return (false);

    const { top, bottom } = ref.getBoundingClientRect();
    const firstPoint = points[0];

    return (
        firstPoint.y >= top &&
        firstPoint.y <= bottom
    );
};
export const findRectPage = (ref: HTMLCanvasElement | undefined, rect: DOMRect) => {
    if (!ref) return (false);

    const { top, bottom } = ref.getBoundingClientRect();

    return (
        rect.top >= top &&
        rect.bottom <= bottom
    );
};
