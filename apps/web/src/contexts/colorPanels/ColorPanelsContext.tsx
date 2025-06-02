import { createContext, useContext } from "react";

import { getContextError } from "../utils";

/** Color indexed */
export type ColorPanel = {
    readonly colors: Record<string, string>;
    readonly id: string;
    readonly title: string;
};
/** Id indexed */
export type ColorPanels = Record<string, ColorPanel>;
/** Provides basic methods to interacts with the color panels */
type ColorPanelsContextType = {
    readonly colorPanels: ColorPanels;
    readonly createPanel: (colorPanel: ColorPanel) => void;
    readonly deletePanel: (id: string) => void;
    /** PUT Operation on color panels */
    readonly updatePanel: (colorPanel: ColorPanel) => void;
};
export const ColorPanelsContext = createContext<ColorPanelsContextType | null>(null);

export const useColorPanels = () => {
    const context = useContext(ColorPanelsContext);

    if (!context) {
        throw new Error(getContextError("useColorPanels", "ColorPanelsProvider"));
    }

    return (context);
};
