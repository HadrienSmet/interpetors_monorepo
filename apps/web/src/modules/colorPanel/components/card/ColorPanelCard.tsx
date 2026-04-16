import { useState } from "react";
import { PiPencil, PiTrash } from "react-icons/pi";

import { Modal } from "@/components";
import { rgbToRgba, stringToRgbColor } from "@/utils";

import { useColorPanel } from "../../contexts";
import { ColorPanelType } from "../../types";

import { ColorPanelForm } from "../form";

import "./colorPanelCard.scss";

type ColorPanelCardProps = {
    readonly colorPanel: ColorPanelType;
};
export const ColorPanelCard = ({ colorPanel }: ColorPanelCardProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const { deletePanel, updatePanel } = useColorPanel();

    const close = () => setIsEditing(false);
    // TODO BACK-END: Should trigger an update in the server for: folders, notes and vocabulary
    const handleDelete = () => deletePanel(colorPanel.id);
    const open = () => setIsEditing(true);
    const submit = async (params: Omit<ColorPanelType, "id">) => {
        setIsPending(true);
        await updatePanel({ ...params, id: colorPanel.id });
        setIsPending(false);
        close();
    };

	return (
		<div className="color-panel-card">
			<div className="color-panel-card__body">
				<p>{colorPanel.name}</p>
				<div className="color-badges">
					{colorPanel.colors.map(colorSwatch => (
						<div 
							className="color-badge" 
							key={colorSwatch.id}
							style={{ 
								backgroundColor: rgbToRgba(stringToRgbColor(colorSwatch.value), 0.2), 
								color: rgbToRgba(stringToRgbColor(colorSwatch.value), 0.65), 
							}}
						>
							<span>{colorSwatch.name}</span>
						</div>
					))}
				</div>
			</div>
			<div className="buttons-column">
				<button onClick={open}>
					<PiPencil />
				</button>
				<button
					onClick={handleDelete}
				>
					<PiTrash />
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
					isPending={isPending}
					//@ts-expect-error
					onSubmit={submit}
				/>
			</Modal>
		</div>
	);
};
