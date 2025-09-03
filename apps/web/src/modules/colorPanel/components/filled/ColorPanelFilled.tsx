import { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";

import { Modal } from "@/components";
import { useCssVariable } from "@/hooks";

import { useColorPanel } from "../../contexts";
import { ColorPanelType } from "../../types";

import { ColorPanelDisplayer } from "../displayer";
import { ColorPanelForm } from "../form";

import "./colorPanelFilled.scss";

type ColorPanelFilledProps = {
    readonly colorPanel: ColorPanelType;
};
export const ColorPanelFilled = ({ colorPanel }: ColorPanelFilledProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const { deletePanel, updatePanel } = useColorPanel();
    const displayerBg = useCssVariable("--clr-bg-light");

    const close = () => setIsEditing(false);
    // TODO BACK-END: Should trigger an update in the server for: folders, notes and vocabulary
    const handleDelete = () => deletePanel(colorPanel.id);
    const open = () => setIsEditing(true);
    const submit = (params: Omit<ColorPanelType, "id">) => {
        updatePanel({ ...params, id: colorPanel.id });
        close();
    };

    return (
        <div className="color-panel-filled">
            <ColorPanelDisplayer
                {...colorPanel}
                backgroundColor={displayerBg}
            />
            <div className="buttons-column">
                <button onClick={open}>
                    <MdEdit />
                </button>
                <button
                    onClick={handleDelete}
                >
                    <MdDelete />
                </button>
            </div>
            <Modal
                isOpen={isEditing}
                onClose={close}
                width="60%"
            >
                <ColorPanelForm
                    colorPanel={colorPanel}
                    isOpen={isEditing}
                    // @ts-expect-error
                    onSubmit={submit}
                />
            </Modal>
        </div>
    );
};
