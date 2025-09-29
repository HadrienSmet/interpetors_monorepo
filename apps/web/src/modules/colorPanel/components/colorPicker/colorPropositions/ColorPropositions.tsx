import { getPdfRgbColor, RgbColor } from "@/utils";

import { useColorPanel } from "../../../contexts";

import "./colorPropositions.scss";

type ColorPropositionsProps = {
    readonly isLandscape: boolean;
    readonly onSelection?: () => void;
    readonly setColor: (color: RgbColor) => void;
};
export const ColorPropositions = ({ isLandscape, onSelection, setColor }: ColorPropositionsProps) => {
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
                        setColor(getPdfRgbColor(color.value));

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
