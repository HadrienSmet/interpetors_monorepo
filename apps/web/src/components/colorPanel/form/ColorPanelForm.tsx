import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { MdAdd } from "react-icons/md";
import { useTranslation } from "react-i18next";

import { ColorPanel } from "@/contexts";
import { useCssVariable } from "@/hooks";
import { getRgbColor, getRoundedRgbColor, RgbColor } from "@/utils";

import { Button, ColorPicker, InputStyleLess } from "../../ui";

import { ColorPanelDisplayer } from "../displayer";

import "./colorPanelForm.scss";

type AddColorRowProps = {
    readonly addColor: () => void;
    readonly color: RgbColor;
    readonly colorName: string;
    readonly onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};
const AddColorRow = (props: AddColorRowProps) => {
    const inputBg = useCssVariable("--clr-bg-light");
    const { t } = useTranslation();

    const colorToUse = useMemo(() => getRgbColor(props.color), [props.color]);

    return (
        <div className="add-color">
            <div className="inputs">
                <div className="cell">
                    <div
                        className="color-indicator"
                        style={{ backgroundColor: colorToUse }}
                    />
                </div>
                <div className="cell">
                    <InputStyleLess
                        id="color-name"
                        onChange={props.onChange}
                        placeholder={t("colorPanel.colors.placeholder")}
                        style={{ backgroundColor: inputBg }}
                        value={props.colorName}
                    />
                </div>
            </div>
            <button
                onClick={props.addColor}
                disabled={props.colorName === ""}
            >
                <p>{t("actions.add")}</p>
                <MdAdd />
            </button>
        </div>
    );
};

const DEFAULT_COLOR = { r: 0, g: .2, b: 1 } as const;
type ColorPanelFormProps = {
    readonly colorPanel?: ColorPanel;
    readonly isOpen: boolean;
    readonly onSubmit: (colorsRecord: Omit<ColorPanel, "id"> | ColorPanel) => void;
};
export const ColorPanelForm = ({ colorPanel, isOpen, onSubmit }: ColorPanelFormProps) => {
    const [color, setColor] = useState<RgbColor>(DEFAULT_COLOR);
    const [colorName, setColorName] = useState("");
    const [colorPickerWidth, setColorPickerWidth] = useState(0);
    const [colorsRecord, setColorsRecord] = useState<Omit<ColorPanel, "id">>({
        title: "",
        colors: {},
    });

    const containerRef = useRef<HTMLDivElement>(null);

    const { t } = useTranslation();

    const addColor = () => {
        setColorsRecord(state => ({
            ...state,
            colors: {
                ...state.colors,
                [getRoundedRgbColor(color)]: colorName,
            }
        }));

        setColor(DEFAULT_COLOR);
        setColorName("");
    };
    const removeColor = (color: string) => setColorsRecord(state => {
        const copy = { ...state };

        delete copy.colors[color];

        return (copy);
    })

    useEffect(() => {
        if (colorPanel) setColorsRecord(colorPanel);
    }, []);
    useEffect(() => {
        if (isOpen && containerRef.current) {
            const resizeObserver = new ResizeObserver(() => {
                setColorPickerWidth(containerRef.current!.getBoundingClientRect().width);
            });

            resizeObserver.observe(containerRef.current);

            // Set initial width
            setColorPickerWidth(containerRef.current.getBoundingClientRect().width);

            return () => resizeObserver.disconnect();
        }
    }, [isOpen]);

    return (
        <div className="color-panel__form">
            <h2>{t("colorPanel.creation.title")}</h2>
            <div className="form-section">
                <label htmlFor="">{t("colorPanel.title.label")} ({t("inputs.notRequired")})</label>
                <InputStyleLess
                    placeholder={t("colorPanel.title.placeholder")}
                    onChange={(e) => setColorsRecord(state => ({
                        ...state,
                        title: e.target.value,
                    }))}
                    value={colorsRecord.title}
                />
            </div>
            <div className="form-section">
                <label>{t("colorPanel.colors.label")}</label>
                <div
                    className="color-input-container"
                    style={{ maxHeight: 300 }}
                >
                    <div
                        className="color-picker-container"
                        ref={containerRef}
                    >
                        <ColorPicker
                            color={color}
                            setColor={setColor}
                            width={colorPickerWidth}
                            height={300}
                        />
                    </div>
                    <div className="color-displayer-container">
                        <ColorPanelDisplayer
                            colors={colorsRecord.colors}
                            paddingBottom={80}
                            onRemove={removeColor}
                        />
                        <AddColorRow
                            color={color}
                            colorName={colorName}
                            addColor={addColor}
                            onChange={(e) => setColorName(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <Button
                disabled={
                    Object.keys(colorsRecord.colors).length < 1 ||
                    colorsRecord.title === ""
                }
                label={t("actions.confirm")}
                onClick={() => onSubmit(colorsRecord)}
            />
        </div>
    );
};
