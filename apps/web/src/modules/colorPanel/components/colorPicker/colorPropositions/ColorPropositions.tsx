import { ColorSwatch } from "@/modules/colorPanel/types";

import { useColorPanel } from "../../../contexts";

import "./colorPropositions.scss";

type ColorPropositionsProps = {
    readonly handleProposition: (colorSwatch: ColorSwatch) => void;
    readonly isLandscape: boolean;
    readonly onSelection?: () => void;
};
export const ColorPropositions = ({ handleProposition, isLandscape, onSelection }: ColorPropositionsProps) => {
    const { colorPanel } = useColorPanel();

    if (!colorPanel) {
        return (null);
    }

    return (
        <div
            className="color-propositions"
            style={{
                flexDirection: isLandscape
                    ? "row"
                    : "column"
            }}
        >
            {colorPanel.colors.map(color => (
                <button
                    key={`proposition-${color.name}`}
                    onClick={() => {
                        handleProposition(color);

                        if (onSelection) {
                            onSelection();
                        }
                    }}
                    style={{ backgroundColor: color.value }}
                    title={color.name!}
                />
            ))}
        </div>
    );
};
