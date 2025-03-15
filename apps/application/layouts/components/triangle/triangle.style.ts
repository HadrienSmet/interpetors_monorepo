import { StyleSheet } from "react-native";

import { Shadows } from "@/theme";

export const TRIANGLE_ZINDEX = 2 as const;

const styles = StyleSheet.create({
    triangle: {
        ...Shadows.large,
    },
    triangleContainer: {
        width: "100%",
        zIndex: TRIANGLE_ZINDEX,
    },
});

export default styles;
