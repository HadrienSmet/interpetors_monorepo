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

export const ButtonCore = (props: GenericButtonProps) => {
    const { t } = useTranslation();

    const buttonContent = useMemo(() => (
        props.labelKey
            ? <Text style={props.labelStyle}>{t(props.labelKey)}</Text>
            : props.children
    ), [props, t]);

    return (
        <TouchableOpacity 
            onPress={props.onPress} 
            style={[styles.container, props.containerStyle]}
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
