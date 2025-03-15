/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from "../../constants";

import { useColorScheme } from "./useColorScheme";

export type ColorName = 
    & keyof typeof Colors.light 
    & keyof typeof Colors.dark;
type UseThemeColorParams = {
    colorName: ColorName;
    override?: {
        light: string;
        dark: string;
    };
};
export const useThemeColor = (params: UseThemeColorParams) => {
    const { colorName, override } = params;
    const theme = useColorScheme() ?? "light";

    const output = override 
        ? override[theme]
        : Colors[theme][colorName];

    return (output);
};
