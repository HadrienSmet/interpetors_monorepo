import { useColorPanel } from "@/hooks";
import { getPdfRgbColor, RgbColor } from "@/utils";

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
            {Object.keys(colorPanel.colors).map(key => (
                <button
                    key={`proposition-${key}`}
                    onClick={() => {
                        setColor(getPdfRgbColor(key));

                        if (onSelection) {
                            onSelection();
                        }
                    }}
                    style={{ backgroundColor: key }}
                    title={colorPanel.colors[key]!}
                />
            ))}
        </div>
    );
};
