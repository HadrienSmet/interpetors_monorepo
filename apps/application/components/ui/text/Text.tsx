import { Text as RNText, type TextProps, StyleSheet } from "react-native";

import { LineHeights, linkColor, Sizes, useThemeColor } from "@/theme";

type TextType = "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
export type ThemedTextProps = 
    & TextProps 
    & { readonly type?: TextType; };

export function Text({
    style,
    type = "default",
    ...rest
}: ThemedTextProps) {
    const color = useThemeColor({ colorName: "textPrimary" });

    return (
        <RNText
            style={[
                { color },
                type === "default" ? styles.default : undefined,
                type === "title" ? styles.title : undefined,
                type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
                type === "subtitle" ? styles.subtitle : undefined,
                type === "link" ? styles.link : undefined,
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
        lineHeight: LineHeights.default,
        fontWeight: "600",
    },
    title: {
        fontSize: Sizes.title,
        fontWeight: "bold",
        lineHeight: LineHeights.title,
    },
    subtitle: {
        fontSize: Sizes.subTitle,
        fontWeight: "bold",
    },
    link: {
        lineHeight: LineHeights.link,
        fontSize: Sizes.default,
        color: linkColor,
    },
});
