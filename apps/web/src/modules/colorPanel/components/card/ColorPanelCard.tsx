import { PiPencil, PiTrash } from "react-icons/pi";

import { rgbToRgba, stringToRgbColor } from "@/utils";

import { useColorPanel } from "../../contexts";
import { ColorPanelType } from "../../types";

import "./colorPanelCard.scss";

type ColorPanelCardProps = {
    readonly colorPanel: ColorPanelType;
	readonly panelToUpdate: ColorPanelType | undefined;
	readonly setPanelToUpdate: (id: ColorPanelType | undefined) => void; 
};
export const ColorPanelCard = ({ colorPanel, panelToUpdate, setPanelToUpdate }: ColorPanelCardProps) => {
    const { deletePanel } = useColorPanel();

    // TODO BACK-END: Should trigger an update in the server for: folders, notes and vocabulary
    const handleDelete = () => deletePanel(colorPanel.id);
	const toggleEdit = () => {
		if (panelToUpdate?.id === colorPanel.id) {
			setPanelToUpdate(undefined);
			return;
		}

		setPanelToUpdate(colorPanel);
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
				<button onClick={toggleEdit}>
					<PiPencil />
				</button>
				<button onClick={handleDelete}>
					<PiTrash />
				</button>
			</div>
		</div>
	);
};
