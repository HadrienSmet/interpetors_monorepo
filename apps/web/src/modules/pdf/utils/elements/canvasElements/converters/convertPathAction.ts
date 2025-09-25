import { PathCanvasElement } from "@repo/types";

import { PathAction } from "@/modules/files";
import { getRgbColor } from "@/utils";

export const convertPathAction = (pathAction: PathAction): PathCanvasElement => {
    const pathElement: PathCanvasElement = {
        color: getRgbColor(pathAction.element.color),
        points: pathAction.element.points.map(point => ({x: point.x - pathAction.element.pageDimensions.left, y: point.y - pathAction.element.pageDimensions.top}))
    };

    return (pathElement);
};
