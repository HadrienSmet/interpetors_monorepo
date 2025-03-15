import { useMemo } from "react";

import { useEnvironment } from "@/contexts";

export type UseTriangleProps = {
    readonly triangleVH: number;
};
export const useTriangle = ({ triangleVH }: UseTriangleProps) => {
    const { dimensions } = useEnvironment();

    const output = useMemo(() => {
        const height = dimensions.height ?? 0;
        const width = dimensions.width ?? 0;

        const triangleHeight = height * triangleVH;
        const triangleHypotenuse = Math.hypot(triangleHeight, width);

        const angleInRadians = Math.atan(triangleHeight / width);
        const angleInDegree = (angleInRadians * 180) / Math.PI;

        return ({
            triangleHeight,
            triangleHypotenuse,
            angleInDegree,
        });
    }, [dimensions]);

    return (output);
};
