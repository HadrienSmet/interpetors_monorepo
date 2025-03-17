import { StyleSheet, View } from "react-native";

import { ButtonPrimary } from "@/components/ui";
import { Spacings } from "@/theme";

type ContentProps = {
    readonly isLoading: boolean;
    readonly onSubmit: () => Promise<void>;
};
export const Content = (props: ContentProps) => {
    return (
        <View style={styles.content}>
            <ButtonPrimary 
                onPress={props.onSubmit} 
                isLoading={props.isLoading}
                labelKey="views.welcome.button" 
            />
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
});
