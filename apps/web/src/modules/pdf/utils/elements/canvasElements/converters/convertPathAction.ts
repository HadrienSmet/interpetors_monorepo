import { CanvasColor, ColorKind, PathCanvasElement } from "@repo/types";

import { PathAction } from "@/modules/files";
import { getRgbColor } from "@/utils";

export const convertPathAction = (pathAction: PathAction): PathCanvasElement => {
    const { element } = pathAction;

    const colorToUse: CanvasColor = element.color.kind === ColorKind.PANEL
        ? element.color
        : {
            kind: ColorKind.INLINE,
            value: getRgbColor(element.color.value),
        };
    const pathElement: PathCanvasElement = {
        color: colorToUse,
        points: element.points.map(point => ({ x: point.x - element.pageDimensions.left, y: point.y - element.pageDimensions.top })),
    };

    return (pathElement);
};
