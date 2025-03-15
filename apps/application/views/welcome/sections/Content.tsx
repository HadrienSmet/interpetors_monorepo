import { StyleSheet, View } from "react-native";

import { ButtonPrimary } from "@/components/ui";
import { Spacings } from "@/theme";

export const Content = () => {
    return (
        <View style={styles.content}>
            <ButtonPrimary onPress={() => console.log("hello")} labelKey="views.welcome.button" />
        </View>
    );
};

const styles = StyleSheet.create({
    content: { 
        alignItems: "center", 
        flex: 1, 
        justifyContent: "center", 
        paddingInline: Spacings.xl, 
    },
})
