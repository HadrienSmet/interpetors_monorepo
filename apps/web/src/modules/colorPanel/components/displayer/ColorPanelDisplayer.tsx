import { PiX } from "react-icons/pi";
import { useTranslation } from "react-i18next";

import { ColorSwatch } from "../../types";

import "./colorPanelDisplayer.scss";

type ColorPanelItemProps = {
    readonly color: string;
    readonly name: string;
    readonly onRemove?: (key: string) => void;
};
const ColorPanelItem = ({ color, name, onRemove }: ColorPanelItemProps) => (
    <div className="row">
        <div className="cell">
            <div
                className="color-indicator"
                style={{ backgroundColor: color }}
            />
        </div>
        <div className="cell">
            <p>{name}</p>
        </div>
        {onRemove && (
            <button onClick={() => onRemove(color)}>
                <PiX />
            </button>
        )}
    </div>
);

type ColorPanelDisplayerProps = {
    readonly backgroundColor?: string;
    readonly onRemove?: (key: string) => void;
    readonly paddingBottom?: number;
    readonly colors: Array<Omit<ColorSwatch, "id">>;
};
export const ColorPanelDisplayer = ({
    backgroundColor,
    colors,
    onRemove,
    paddingBottom = 0,
}: ColorPanelDisplayerProps) => {
    const { t } = useTranslation();

    return (
        <div
            className="color-panel-displayer"
            style={backgroundColor
                ? { backgroundColor }
                : {}
            }
        >
            <div className="row">
                <div className="cell">
                    <p>{t("colorPanel.displayer.color")}</p>
                </div>
                <div className="cell">
                    <p>{t("colorPanel.displayer.name")}</p>
                </div>
            </div>
            <div
                className="colors-list"
                style={{ paddingBottom }}
            >
                {colors.length > 0 && colors.map(color => (
                    <ColorPanelItem
                        color={color.value}
                        name={color.name}
                        key={color.name}
                        onRemove={onRemove}
                    />
                ))}
            </div>
        </div>
    );
};
