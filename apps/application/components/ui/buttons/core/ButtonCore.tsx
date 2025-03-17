import { PropsWithChildren, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    GestureResponderEvent,
    StyleProp,
    StyleSheet,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from "react-native";

import { Radius } from "@/theme";

import { Text } from "../../text";

type ButtonIntrinsequeProps = {
    readonly containerStyle: StyleProp<ViewStyle>;
    readonly isLoading?: boolean;
    readonly onPress: (event: GestureResponderEvent) => void;

    readonly labelKey?: string; 
    readonly labelStyle?: StyleProp<TextStyle>;
};

type GenericButtonProps = 
    & ButtonIntrinsequeProps 
    & PropsWithChildren;
export type ButtonProps = 
    & Omit<GenericButtonProps, "containerStyle"> 
    & { containerStyle?: StyleProp<ViewStyle> };

export const ButtonCore = ({
    children,
    containerStyle,
    isLoading = false,
    labelKey,
    labelStyle,
    onPress,
}: GenericButtonProps) => {
    const { t } = useTranslation();

    const buttonContent = useMemo(() => (
        isLoading 
            ? <Text>Loading...</Text>
            : labelKey
                ? <Text style={labelStyle}>{t(labelKey)}</Text>
                : children
    ), [isLoading, labelKey, labelStyle, children, t]);

    return (
        <TouchableOpacity 
            onPress={onPress} 
            style={[styles.container, containerStyle]}
        >
            {buttonContent}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: { 
        alignItems: "center",
        borderRadius: Radius.default, 
        justifyContent: "center", 
        width: "100%", 
    },
});
