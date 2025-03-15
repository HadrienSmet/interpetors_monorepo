import { MutableRefObject } from "react";
import { StyleSheet, View } from "react-native";

import { Input, Text, TextInputRef } from "@/components/ui";
import { APP_NAME } from "@/constants";
import { Sizes, Spacings } from "@/theme";

type HeaderProps = {
    readonly emailRef: MutableRefObject<TextInputRef | null>;
    readonly passwordRef: MutableRefObject<TextInputRef | null>;
};
export const Header = ({ emailRef, passwordRef }: HeaderProps) => (
    <View style={styles.container}>
        <Text style={styles.title}>{APP_NAME}</Text>
        <View style={styles.mainContent}>
            <Text>Welcome back !</Text>
            <View style={styles.formContainer}>
                <Input label="Email" textContentType="emailAddress" ref={emailRef} />
                <Input label="Password" textContentType="password" isSecuredInput ref={passwordRef} />
            </View>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingInline: Spacings.l,
        paddingTop: Spacings.m,
    },
    formContainer: {
        gap: Spacings.l,
        paddingTop: Spacings.h,
        width: "100%",
    },
    mainContent: {
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        paddingBlock: Spacings.m,
        width: "100%",
    },
    title: {
        fontFamily: "Title",
        fontSize: Sizes.header,
    },
});
