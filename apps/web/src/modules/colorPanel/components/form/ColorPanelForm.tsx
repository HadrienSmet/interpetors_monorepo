import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiX } from "react-icons/pi";

import { RgbColor } from "@repo/types";

import { Button, Input } from "@/components";
import { getRgbColor, getRoundedRgbColor } from "@/utils";

import { ColorPanelInCreation, ColorPanelType } from "../../types";

import { ColorPicker } from "../colorPicker";

import "./colorPanelForm.scss";

const COLOR_PANEL_HEIGHT = 300 as const;
const DEFAULT_COLOR = { r: .1, g: .2, b: 1 } as const;
const EMPTY_PANEL: ColorPanelInCreation = {
	name: undefined,
	colors: [],
} as const;

type ColorPanelFormProps = {
    readonly colorPanel?: ColorPanelType;
    readonly isPending: boolean;
    readonly onSubmit: (colorsRecord: ColorPanelInCreation) => void;
};
export const ColorPanelForm = ({ colorPanel, isPending, onSubmit }: ColorPanelFormProps) => {
    const [color, setColor] = useState<RgbColor>(DEFAULT_COLOR);
    const [colorName, setColorName] = useState("");
    const [colorPickerWidth, setColorPickerWidth] = useState(0);
    const [colorPanelInCreation, setColorPanelInCreation] = useState<ColorPanelInCreation>({ ...EMPTY_PANEL });

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
	const handleColorName = (e: ChangeEvent<HTMLInputElement>) => setColorName(e.target.value);
    const onChange = (e: ChangeEvent<HTMLInputElement>) => setColorPanelInCreation(state => ({
        ...state,
        name: e.target.value,
    }));
	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Enter") {
			addColor();
		}
	};
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
		else setColorPanelInCreation({ ...EMPTY_PANEL });
    }, [colorPanel]);
	useEffect(() => {
		if (!containerRef.current) {
			return;
		}

		const updateWidth = () => {
			const nextWidth = containerRef.current?.getBoundingClientRect().width ?? 0;

			setColorPickerWidth(prev => (prev !== nextWidth ? nextWidth : prev));
		};

		const resizeObserver = new ResizeObserver(() => {
			updateWidth();
		});

		resizeObserver.observe(containerRef.current);
		updateWidth();

		return () => resizeObserver.disconnect();
	}, []);

    return (
        <div className="color-panel-form">
			<div className="color-panel-form__header">
				<h2>
					{colorPanel
						? t("colorPanel.update.title")
						: t("colorPanel.creation.title")
					}
				</h2>
				<p>{t("colorPanel.subtitle")}</p>
			</div>
            <div className="form-section">
                <label htmlFor="panel-title">{t("colorPanel.titles.label")} ({t("inputs.notRequired")})</label>
                <Input
					id="panel-title"
                    onChange={onChange}
                    placeholder={t("colorPanel.titles.placeholder")}
                    value={colorPanelInCreation.name ?? ""}
                />
            </div>
            <div className="form-section">
                <label>{t("colorPanel.colors.label")}</label>
                <div
                    className="color-panel-form__color-section"
                    style={{ maxHeight: COLOR_PANEL_HEIGHT }}
                >
                    <div
                        className="color-picker-container"
                        ref={containerRef}
                    >
                        <ColorPicker
                            color={color}
                            handlePickerColor={setColor}
                            height={COLOR_PANEL_HEIGHT}
                            width={colorPickerWidth}
                        />
                    </div>

					<div className="color-panel-form__color-details">
						<div className="color-row">
							<div 
								className="color" 
								style={{ backgroundColor: getRgbColor(color) }} 
							/>
							<p>{getRoundedRgbColor(color)}</p>
						</div>
						<div className="title-row">
							<label htmlFor="color-title">{t("colorPanel.colorTitle")}</label>
							<Input 
								autoComplete="off"
								id="color-title"
								onChange={handleColorName}
								onKeyDown={onKeyDown}
								placeholder="Technical"
								value={colorName}
							/>
						</div>
						<Button onClick={() => addColor()} label="Add color" />
					</div>

					<div className="color-panel-form__colors-container">
						<div className="color-panel-form__colors">
							{colorPanelInCreation.colors.map(clr => (
								<div 
									className="color-panel-form__color-card"
									key={`${clr.name}-${clr.value}`}
								>
									<div className="color-panel-form__color-card-data">
										<div
											className="color-panel-form__color-indicator" 
											style={{ backgroundColor: clr.value }} 
										/>
										<p>{clr.name}</p>
									</div>
									<PiX onClick={() => removeColor((clr.value))} />
								</div>
							))}
						</div>
					</div>
                </div>
            </div>
			<div className="color-panel-form__submit-row">
				<Button
					disabled={colorPanelInCreation.colors.length < 1}
					isPending={isPending}
					label={t("actions.confirm")}
					onClick={() => onSubmit(colorPanelInCreation)}
				/>
			</div>
        </div>
    );
};
