import { PropsWithChildren, useMemo } from "react";
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

    readonly label?: string; 
    readonly labelStyle?: StyleProp<TextStyle>;
};

type GenericButtonProps = 
    & ButtonIntrinsequeProps 
    & PropsWithChildren;
export type ButtonProps = 
    & Omit<GenericButtonProps, "containerStyle"> 
    & { containerStyle?: StyleProp<ViewStyle> };

export const ButtonCore = (props: GenericButtonProps) => {
    const buttonContent = useMemo(() => (
        "label" in props
            ? <Text style={props.labelStyle}>{props.label}</Text>
            : props.children
    ), [props]);

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
