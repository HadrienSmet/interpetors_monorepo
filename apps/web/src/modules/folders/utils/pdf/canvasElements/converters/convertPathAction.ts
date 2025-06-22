import { getRgbColor } from "@/utils";

import { PathAction, PathCanvasElement } from "../../../../types";

export const convertPathAction = (pathAction: PathAction): PathCanvasElement => {
    const pathElement: PathCanvasElement = {
        color: getRgbColor(pathAction.element.color),
        pageIndex: pathAction.element.pageIndex,
        points: pathAction.element.points.map(point => ({x: point.x - pathAction.element.pageDimensions.left, y: point.y - pathAction.element.pageDimensions.top}))
    };

    return (pathElement);
};
