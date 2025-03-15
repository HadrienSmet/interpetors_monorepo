import { useEffect } from "react";
import "react-native-reanimated";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import { SafeAreaWrapper } from "@/components/wrappers";
import { EnvironmentProvider, LanguageProvider } from "@/contexts";
import { useColorScheme } from "@/theme";

const AppStacks = () => (
    <>
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
    </>
);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
        Title: require("../assets/fonts/PoiretOne-Regular.ttf"),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return (null);
    }

    return (
        // Display Wrappers
        <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
            <EnvironmentProvider>
                <SafeAreaWrapper>
                    <LanguageProvider>
                        <AppStacks />
                    </LanguageProvider>
                </SafeAreaWrapper>
            </EnvironmentProvider>
        </ThemeProvider>
    );
};
