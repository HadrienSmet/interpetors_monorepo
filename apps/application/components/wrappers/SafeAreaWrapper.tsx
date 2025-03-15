import { PropsWithChildren, ReactNode } from "react";
import { SafeAreaView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Os, useEnvironment } from "@/contexts";
import { useThemeColor } from "@/theme";

export const SafeAreaWrapper = (props: PropsWithChildren): ReactNode => {
    const { deviceInfo } = useEnvironment();
    const { bottom, left, right, top } = useSafeAreaInsets();
    const backgroundColor = useThemeColor({ colorName: "backgroundSecondary" });

    if (deviceInfo.os === Os.IOS) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                {props.children}
            </SafeAreaView>
        );
    }

    return (
        <View
            style={{
                backgroundColor, 
                flex: 1,
                paddingBottom: bottom, 
                paddingLeft: left, 
                paddingRight: right,
                paddingTop: top,
            }}
        >
            {props.children}
        </View>
    );
};