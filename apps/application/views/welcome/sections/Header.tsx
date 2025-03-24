import { MutableRefObject } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Input, Text, TextInputRef } from "@/components/ui";
import { APP_NAME } from "@/constants";
import { Sizes, Spacings, useThemeColor } from "@/theme";

type InputHeaderProps = {
    ref: MutableRefObject<TextInputRef | null>;
    errorMessage: string | null;
};
type HeaderProps = {
    readonly email: InputHeaderProps;
    readonly password: InputHeaderProps;
};
export const Header = ({ email, password }: HeaderProps) => {
    const { t } = useTranslation();
    const titleColor = useThemeColor({ colorName: "textOnBackground" });

    const {
        ref: passwordRef,
        errorMessage: passwordErrorMessage,
    } = password;
    const {
        ref: emailRef,
        errorMessage: emailErrorMessage,
    } = email;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{APP_NAME}</Text>
            <View style={styles.mainContent}>
                <View style={styles.titleContainer}>
                    <Text style={{ color: titleColor }} type="title">{t("views.welcome.title")}</Text>
                </View>
                <View style={styles.formContainer}>
                    <Input 
                        ref={emailRef} 
                        errorMessage={emailErrorMessage}
                        labelKey="inputs.email.label" 
                        placeholderKey="inputs.email.placeholder"
                        textContentType="emailAddress" 
                        onBackground
                    />
                    <Input 
                        ref={passwordRef} 
                        errorMessage={passwordErrorMessage}
                        labelKey="inputs.password.label" 
                        placeholderKey="inputs.password.placeholder"
                        textContentType="password" 
                        isSecuredInput 
                        onBackground
                    />
                </View>
            </View>
        </View>
    );
};

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
        flex: 1,
        justifyContent: "space-between",
        paddingBlock: Spacings.m,
        width: "100%",
    },
    title: {
        fontFamily: "Title",
        fontSize: Sizes.header,
    },
    titleContainer: { 
        flexGrow: 1, 
        justifyContent: "center",
    },
});
