import { PropsWithChildren, useCallback, useState } from "react";
import { GestureResponderEvent, KeyboardAvoidingView, StyleSheet } from "react-native";

import { Os, useEnvironment } from "@/contexts";

import { ScrollViewWithStickyHeader } from "../scrollViewWithStickyHeader";

const VERTICAL_OFFSETS = {
    android: 0,
    ios: 40,
} as const;
const VIEW_BEHAVIOR = "position";

export const CustomKeyboardAvoidingView = (props: PropsWithChildren) => {
    const [enabled, setEnabled] = useState(false);
    
    const { dimensions, deviceInfo } = useEnvironment();

    const handleTouch = useCallback(
        ({ nativeEvent }: GestureResponderEvent): void => setEnabled(nativeEvent.pageY > (dimensions.height ?? 0) / 2),
        [dimensions.height]
    );

    return (
        <KeyboardAvoidingView
            behavior={VIEW_BEHAVIOR}
            enabled={enabled}
            keyboardVerticalOffset={deviceInfo.os === Os.IOS ? VERTICAL_OFFSETS.ios : VERTICAL_OFFSETS.android}

            style={styles.keyboardAvoidingView}
            contentContainerStyle={styles.keyboardAvoidingViewContent}

            onTouchStart={handleTouch}
        >
            <ScrollViewWithStickyHeader>
                {props.children}
            </ScrollViewWithStickyHeader>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingView: { flex: 1, width: "100%" },
    keyboardAvoidingViewContent: { flex: 1 },
});
