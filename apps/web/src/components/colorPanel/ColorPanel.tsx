import { useColorPanels, WorkSpace } from "@/contexts";

import { ColorPanelFilled } from "./filled";
import { ColorPanelMissing } from "./missing";

import "./colorPanel.scss";

type ColorPanelProps = {
    readonly workspace: WorkSpace;
}
export const ColorPanel = (props: ColorPanelProps) => {
    const { colorPanels } = useColorPanels();

    return (
        <div className="color-panel">
            {props.workspace.colorPanel
                ? colorPanels[props.workspace.colorPanel] !== undefined
                    ? (<ColorPanelFilled colorPanel={colorPanels[props.workspace.colorPanel]} />)
                    : (<p>Wrong id</p>)
                : (<ColorPanelMissing />)
            }
        </div>
    );
};
