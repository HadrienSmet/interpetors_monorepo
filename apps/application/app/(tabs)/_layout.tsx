import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { Brain, GraduationCap } from "@/assets";
import { Colors, useColorScheme } from "@/theme";

type TabBarIconProps = {
    focused: boolean;
    color: string;
    size: number;
};
type TabsType = {
    name: string;
    title: string;
    tabBarIcon: (props: TabBarIconProps) => React.ReactNode;
};

const TABS_ICON_SIZE = 28 as const;

const TABS: Array<TabsType> = [
    {
        name: "index",
        title: "prepare",
        tabBarIcon: ({ color }) => (
            <Brain color={color} size={TABS_ICON_SIZE} />
        ),
    },
    {
        name: "practice",
        title: "practice",
        tabBarIcon: ({ color }) => (
            <GraduationCap color={color} size={TABS_ICON_SIZE} />
        ),
    },
];

export default function TabLayout() {
    const colorScheme = useColorScheme();

    const renderTabs = (tabs: Array<TabsType>) => (
        tabs.map(({ name, title, tabBarIcon }) => (
            <Tabs.Screen
                name={name}
                key={`tab_${name}`}
                options={{
                    title,
                    tabBarIcon,
                }}
            />
        ))
    );
    const tabs = renderTabs(TABS);
    

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? "light"].tabBarActiveTint,
                headerShown: false,
                // tabBarButton: HapticTab,
                // tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: "absolute",
                    },
                    default: {},
                }),
            }}
        >
            {tabs}
        </Tabs>
    );
}
