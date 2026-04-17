import { PropsWithChildren, useEffect, useState } from "react";

import { getAll } from "../../service";
import { ColorPanelType } from "../../types";

import { ColorPanelsContext } from "./ColorPanelsContext";

export const ColorPanelsProvider = ({ children }: PropsWithChildren) => {
	const [colorPanels, setColorPanels] = useState<Array<ColorPanelType>>([]);
	const [hasFetched, setHasFetched] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchColorPanels = async () => {
			setIsLoading(true);
			const response = await getAll();

			if (!response.success) {
				setIsLoading(false);
				setHasFetched(true);
				throw new Error(`An error occured while retrieving color panels - ${response.message}`);
			}

			setColorPanels(response.data);
			setIsLoading(false);
			setHasFetched(true);
		};
		if (!hasFetched) {
			fetchColorPanels();
		}
	}, [hasFetched]);

	const value = {
		colorPanels,
		hasFetched,
		isLoading,
	};

	return (
		<ColorPanelsContext.Provider value={value}>
			{children}
		</ColorPanelsContext.Provider>
	);
};
