import { useEffect, useRef } from "react";
import { View } from "react-native";

import { useStickyHeader } from "@/contexts";
import { Spacings, useThemeColor } from "@/theme";

import { useTriangle, UseTriangleProps } from "./triangle.hooks";
import styles from "./triangle.style";

type TriangleProps = 
    & UseTriangleProps
    & { isSticky: boolean };
export const Triangle = (props: TriangleProps) => {
    const triangleRef = useRef<View>(null)
    const triangleBg = useThemeColor({ colorName: "backgroundSecondary" });
    const containerBg = useThemeColor({ colorName: "transparent" });

    const { setRenderSticky } = useStickyHeader();
    const { angleInDegree, triangleHeight, triangleHypotenuse } = useTriangle(props);
    const stickyStyle = props.isSticky 
        ? { position: "absolute", top: 0 } as const 
        : undefined;

    useEffect(() => {
        triangleRef.current?.measureInWindow((_, y: number) => setRenderSticky(y < 0));
    });

    return (
        <View 
            ref={triangleRef}
            style={[
                styles.triangleContainer,
                { height: triangleHeight, backgroundColor: containerBg },
                stickyStyle
            ]}
        >
            <View 
                style={[
                    styles.triangle, 
                    { backgroundColor: triangleBg },
                    {
                        width: triangleHypotenuse + Spacings.l,
                        height: triangleHeight,
                        transform: [
                            { translateX: -(triangleHypotenuse / 2) },
                            { translateY: -triangleHeight },
                            { rotate: `${angleInDegree}deg` },
                            { translateX: triangleHypotenuse / 2 },
                        ],
                    },
                ]}
            />
        </View>
    );
};
