import { ChangeEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { MdAdd } from "react-icons/md";
import { useTranslation } from "react-i18next";

import { Button, InputStyleLess } from "@/components";
import { useCssVariable } from "@/hooks";
import { getRgbColor, getRoundedRgbColor, RgbColor } from "@/utils";

import { ColorPanelInCreation, ColorPanelType } from "../../types";

import { ColorPicker } from "../colorPicker";
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

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            props.addColor();
        }
    };

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
                        onKeyDown={onKeyDown}
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

const DEFAULT_COLOR = { r: .1, g: .2, b: 1 } as const;
type ColorPanelFormProps = {
    readonly colorPanel?: ColorPanelType;
    readonly isOpen: boolean;
    readonly onSubmit: (colorsRecord: ColorPanelInCreation) => void;
};
export const ColorPanelForm = ({ colorPanel, isOpen, onSubmit }: ColorPanelFormProps) => {
    const [color, setColor] = useState<RgbColor>(DEFAULT_COLOR);
    const [colorName, setColorName] = useState("");
    const [colorPickerWidth, setColorPickerWidth] = useState(0);
    const [colorPanelInCreation, setColorPanelInCreation] = useState<ColorPanelInCreation>({
        name: undefined,
        colors: [],
    });

    const containerRef = useRef<HTMLDivElement>(null);

    const { t } = useTranslation();

    const addColor = () => {
        setColorPanelInCreation(state => ({
            ...state,
            colors: [
                ...state.colors,
                {
                    value: getRoundedRgbColor(color),
                    name: colorName,
                },
            ],
        }));

        setColorName("");
    };
    const onChange = (e: ChangeEvent<HTMLInputElement>) => setColorPanelInCreation(state => ({
        ...state,
        name: e.target.value,
    }));
    const removeColor = (color: string) => setColorPanelInCreation(state => {
        const copy = { ...state };

        const filteredColors = copy.colors.filter(clr => clr.value !== color);

        return ({
            ...copy,
            colors: filteredColors,
        });
    });

    useEffect(() => {
        if (colorPanel) setColorPanelInCreation(colorPanel);
    }, [colorPanel]);
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
        <div className="color-panel-form">
            <p className="color-panel-form-title">
                {colorPanel
                    ? t("colorPanel.update.title")
                    : t("colorPanel.creation.title")
                }
            </p>
            <div className="form-section">
                <label htmlFor="">{t("colorPanel.title.label")} ({t("inputs.notRequired")})</label>
                <InputStyleLess
                    onChange={onChange}
                    placeholder={t("colorPanel.title.placeholder")}
                    value={colorPanelInCreation.name}
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
                            {...colorPanelInCreation}
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
                disabled={colorPanelInCreation.colors.length < 1}
                label={t("actions.confirm")}
                onClick={() => onSubmit(colorPanelInCreation)}
            />
        </div>
    );
};
