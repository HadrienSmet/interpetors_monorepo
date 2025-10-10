import { PathAction } from "@repo/types";

import { ColorPanelType } from "@/modules/colorPanel";
import { getRgbColor, handleActionColor } from "@/utils";

import { PathCanvasElement } from "../types";

export const convertPathAction = (pathAction: PathAction, colorPanel: ColorPanelType | null): PathCanvasElement => {
    const { element } = pathAction;

    const rgbColor = handleActionColor(element.color, colorPanel);
    const color = getRgbColor(rgbColor);

    const pathElement: PathCanvasElement = {
        color,
        points: element.points.map(point => ({
            x: point.x - element.pageDimensions.left,
            y: point.y - element.pageDimensions.top
        })),
    };

    return (pathElement);
};
