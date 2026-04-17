import { createContext, useContext } from "react";

import { getContextError } from "@/contexts/utils";

import { ColorPanelType } from "../../types";

type ColorPanelsContextType = {
	readonly colorPanels: Array<ColorPanelType>;
	readonly hasFetched: boolean;
	readonly isLoading: boolean;
};
export const ColorPanelsContext = createContext<ColorPanelsContextType | null>(null);

export const useColorPanels = () => {
	const ctx = useContext(ColorPanelsContext);

	if (!ctx) {
		throw new Error(getContextError("useColorPanels", "ColorPanelsProvider"));
	}

	return (ctx);
};
