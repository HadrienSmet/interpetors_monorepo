import { StyleSheet } from "react-native";

import { Spacings } from "@/theme";

import { ButtonCore, ButtonProps } from "./core";

export const ButtonPrimary = (props: ButtonProps) => {

    return (
        <ButtonCore
            {...props} 
            labelStyle={styles.label} 
            containerStyle={[styles.container, props.containerStyle]} 
        />
    )
};

const styles = StyleSheet.create({
    label: { color: "yellow" },
    container: { 
        backgroundColor: "green", 
        paddingBlock: Spacings.s,
    },
});
