import { MdClose } from "react-icons/md";
import { useTranslation } from "react-i18next";

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
                <MdClose />
            </button>
        )}
    </div>
);

type ColorPanelDisplayerProps = {
    readonly backgroundColor?: string;
    readonly colors: Record<string, string>;
    readonly onRemove?: (key: string) => void;
    readonly paddingBottom?: number;
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
                {Object.keys(colors).length > 0 && Object.keys(colors).map(key => (
                    <ColorPanelItem
                        key={key}
                        color={key}
                        name={colors[key]}
                        onRemove={onRemove}
                    />
                ))}
            </div>
        </div>
    );
};
