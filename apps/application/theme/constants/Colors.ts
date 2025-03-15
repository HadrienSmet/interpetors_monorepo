/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const darkIcon = "#9BA1A6";
const errorColor = "rgb(213, 7, 7)";
const lightIcon = "#687076";
export const linkColor = "#0a7ea4";
const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";
const transparentColor = "transparent";

export const Colors = {
    light: {
        backgroundPrimary: "#F3F4F8",
        backgroundSecondary: "rgb(0, 192, 237)",
        backgroundTertiary: "rgb(0, 99, 122)",
        
        icon: lightIcon,

        tabBarActiveTint: tintColorLight,
        tabIconDefault: lightIcon,
        tabIconSelected: tintColorLight,

        textPrimary: "rgba(0,0,0, 0.8)",
        
        error: errorColor,
        link: linkColor,
        transparent: transparentColor,
    },
    dark: {
        backgroundPrimary: "rgba(0,0,0, 0.8)",
        backgroundSecondary: "rgb(0, 192, 237)",
        backgroundTertiary: "rgb(0, 99, 122)",
        
        icon: darkIcon,

        tabBarActiveTint: tintColorDark,
        tabIconDefault: darkIcon,
        tabIconSelected: tintColorDark,

        textPrimary: "#F3F4F8",
        
        error: errorColor,
        link: linkColor,
        transparent: transparentColor,
    },
} as const;
