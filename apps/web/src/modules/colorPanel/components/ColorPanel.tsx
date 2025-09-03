import { ReactNode, useMemo } from "react";

import { Loader } from "@/components";

import { useColorPanel } from "../contexts";

import { ColorPanelFilled } from "./filled";
import { ColorPanelMissing } from "./missing";

import "./colorPanel.scss";

export const ColorPanel = () => {
    const { colorPanel, isLoading } = useColorPanel();

    const content: ReactNode = useMemo(() => {
        if (!colorPanel) {
            return (<ColorPanelMissing />);
        }

        return (<ColorPanelFilled colorPanel={colorPanel} />);
    }, [colorPanel]);

    if (isLoading) {
        return (<Loader />);
    }

    return (
        <div className="color-panel">
            {content}
        </div>
    );
};
