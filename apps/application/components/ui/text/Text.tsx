import { Text as RNText, type TextProps, StyleSheet } from "react-native";

import { LineHeights, linkColor, Sizes, useThemeColor } from "@/theme";

type TextType = "default" | "defaultSemiBold" | "errorMessage" | "link" | "subtitle" | "title";
export type ThemedTextProps = 
    & TextProps 
    & { readonly type?: TextType; };

export function Text({
    style,
    type = "default",
    ...rest
}: ThemedTextProps) {
    const color = useThemeColor({ colorName: "textPrimary" });
    const errorColor = useThemeColor({ colorName: "error" });

    return (
        <RNText
            style={[
                { color },
                type === "default" ? styles.default : undefined,
                type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
                type === "errorMessage" ? { ...styles.errorMessage, color: errorColor } : undefined,
                type === "link" ? styles.link : undefined,
                type === "subtitle" ? styles.subtitle : undefined,
                type === "title" ? styles.title : undefined,
                style,
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    default: {
        fontSize: Sizes.default,
        lineHeight: LineHeights.default,
    },
    defaultSemiBold: {
        fontSize: Sizes.default,
        fontWeight: "600",
        lineHeight: LineHeights.default,
    },
    errorMessage: {
        fontSize: Sizes.errorMessage,
        fontWeight: "600",
        letterSpacing: 1,
        lineHeight: LineHeights.errorMessage,
    },
    link: {
        color: linkColor,
        fontSize: Sizes.default,
        lineHeight: LineHeights.link,
    },
    subtitle: {
        fontSize: Sizes.subTitle,
        fontWeight: "bold",
    },
    title: {
        lineHeight: LineHeights.title,
        fontSize: Sizes.title,
        fontWeight: "bold",
    },
});
