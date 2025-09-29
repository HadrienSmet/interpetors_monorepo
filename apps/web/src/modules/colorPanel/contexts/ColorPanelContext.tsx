import { createContext, useContext } from "react";

import { getContextError } from "@/contexts/utils";

import { ColorPanelInCreation, ColorPanelType } from "../types";

/** Provides basic methods to interacts with the color panels */
type ColorPanelContextType = {
    readonly colorPanel: ColorPanelType | null;
    readonly createPanel: (colorPanel: ColorPanelInCreation) => Promise<void>;
    readonly deletePanel: (id: string) => void;
    readonly isLoading: boolean;
    readonly hasFetched: boolean;
    /** PUT Operation on color panels */
    readonly updatePanel: (colorPanel: ColorPanelType) => void;
};
export const ColorPanelContext = createContext<ColorPanelContextType | null>(null);

export const useColorPanel = () => {
    const context = useContext(ColorPanelContext);

    if (!context) {
        throw new Error(getContextError("useColorPanels", "ColorPanelsProvider"));
    }

    return (context);
};
