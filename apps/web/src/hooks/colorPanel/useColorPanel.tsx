import { useMemo } from "react";

import { useColorPanels } from "@/contexts";
import { useWorkSpaces } from "@/modules";

export const useColorPanel = () => {
    const { colorPanels } = useColorPanels();
    const { currentWorkspace } = useWorkSpaces();

    const colorPanel = useMemo(() => {
        if (!currentWorkspace || !currentWorkspace.colorPanelId) {
            return (undefined);
        }

        return (colorPanels[currentWorkspace.colorPanelId]);
    }, [currentWorkspace?.colorPanelId, colorPanels]);

    return ({ colorPanel });
};
