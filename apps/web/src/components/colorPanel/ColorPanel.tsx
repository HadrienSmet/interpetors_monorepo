import { useColorPanels } from "@/contexts";
import { Workspace } from "@/modules";

import { ColorPanelFilled } from "./filled";
import { ColorPanelMissing } from "./missing";

import "./colorPanel.scss";

type ColorPanelProps = {
    readonly workspace: Workspace;
}
export const ColorPanel = (props: ColorPanelProps) => {
    const { colorPanels } = useColorPanels();

    return (
        <div className="color-panel">
            {props.workspace.colorPanelId
                ? colorPanels[props.workspace.colorPanelId] !== undefined
                    ? (<ColorPanelFilled colorPanel={colorPanels[props.workspace.colorPanelId]} />)
                    : (<p>Wrong id</p>)
                : (<ColorPanelMissing />)
            }
        </div>
    );
};
