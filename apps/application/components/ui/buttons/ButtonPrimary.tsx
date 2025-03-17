import { StyleSheet } from "react-native";

import { Spacings, useThemeColor } from "@/theme";

import { ButtonCore, ButtonProps } from "./core";

export const ButtonPrimary = (props: ButtonProps) => {
    const labelColor = useThemeColor({ colorName: "textOnBackground" });
    const buttonColor = useThemeColor({ colorName: "backgroundSecondary" });

    return (
        <ButtonCore
            {...props} 
            labelStyle={[
                { color: labelColor }, 
                styles.label,
            ]} 
            containerStyle={[
                { backgroundColor: buttonColor }, 
                styles.container, 
                props.containerStyle,
            ]} 
        />
    );
};

const styles = StyleSheet.create({
    label: {},
    container: {
        paddingBlock: Spacings.s,
    },
});
