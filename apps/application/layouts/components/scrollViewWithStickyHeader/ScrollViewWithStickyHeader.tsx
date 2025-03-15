import { PropsWithChildren } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from "react-native";

import { StickyHeaderProvider, useEnvironment, useStickyHeader } from "@/contexts";

import { Triangle } from "../triangle";

const TRIANGLE_HEIGHT = 0.07 as const;

const _ScrollViewWithStickyHeader = (props: PropsWithChildren) => {
    const { scroll } = useEnvironment();
    const { hasToRenderSticky } = useStickyHeader();

    const handleScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => scroll.setter(nativeEvent.contentOffset.y);

    return (
        <View style={styles.grow}>
            {hasToRenderSticky && (<Triangle isSticky triangleVH={TRIANGLE_HEIGHT} />)}
            <ScrollView
                style={styles.grow}
                onScroll={handleScroll}
            >   
                {props.children}
            </ScrollView>
        </View>
    ); 
};

export const ScrollViewWithStickyHeader = (props: PropsWithChildren) => (
    <StickyHeaderProvider>
        <_ScrollViewWithStickyHeader>
            {props.children}
        </_ScrollViewWithStickyHeader>
    </StickyHeaderProvider>
);

const styles = StyleSheet.create({
    grow: { flex: 1 },
});
