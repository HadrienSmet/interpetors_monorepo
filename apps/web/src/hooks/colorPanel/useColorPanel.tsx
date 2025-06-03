import { useMemo } from "react";

import { useColorPanels, useWorkSpaces } from "@/contexts";

export const useColorPanel = () => {
    const { colorPanels } = useColorPanels();
    const { currentWorkSpace } = useWorkSpaces();

    const colorPanel = useMemo(() => {
        if (!currentWorkSpace || !currentWorkSpace.colorPanel) {
            return (undefined);
        }

        return (colorPanels[currentWorkSpace.colorPanel]);
    }, [currentWorkSpace?.colorPanel, colorPanels]);

    return ({ colorPanel });
};
