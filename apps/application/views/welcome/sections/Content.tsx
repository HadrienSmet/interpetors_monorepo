import { StyleSheet, View } from "react-native";

import { ButtonPrimary } from "@/components/ui";
import { Spacings } from "@/theme";

export const Content = () => {
    return (
        <View style={styles.content}>
            <ButtonPrimary onPress={() => console.log("hello")} label="Log in" />
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
