import { PropsWithChildren, useEffect, useState } from "react";

import { ColorPanel, ColorPanels, ColorPanelsContext } from "./ColorPanelsContext";

const PANEL_404 = "Color panel nout found - Could not update the color panel.";
const STORAGE_KEY = "colorPanels";

export const ColorPanelsProvider = (props: PropsWithChildren) => {
    const [colorPanels, setColorPanels] = useState<ColorPanels>({});

    useEffect(() => {
        if (Object.keys(colorPanels).length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(colorPanels));
        }
    }, [colorPanels]);
    useEffect(() => {
        const storedItem = localStorage.getItem(STORAGE_KEY);

        if (!storedItem) {
            return;
        }

        setColorPanels(JSON.parse(storedItem));
    }, []);

    const createPanel = (colorPanel: ColorPanel) => {
        if (colorPanel.id in colorPanels) {
            throw new Error("This color panel already exists");
        }

        setColorPanels(state => ({
            ...state,
            [colorPanel.id]: colorPanel,
        }));
    };
    const deletePanel = (id: string) => setColorPanels(state => {
        const copy = { ...state };

        delete copy[id];
        localStorage.removeItem(STORAGE_KEY);

        return (copy);
    });
    /** Operates a PUT operation on color panel record */
    const updatePanel = (colorPanel: ColorPanel) => {
        if (!(colorPanel.id in colorPanels)) {
            throw new Error(PANEL_404);
        }

        setColorPanels(state => ({
            ...state,
            [colorPanel.id]: colorPanel,
        }));
    };
    /** Can be used to create a new color or to rename a color */
    const addColorInPanel = (panelId: string, color: string, name: string) => {
        if (!(panelId in colorPanels)) {
            throw new Error(PANEL_404);
        }

        if (Object.values(colorPanels[panelId].colors).includes(name)) {
            throw new Error("A color already possess that name in this color panel - Could not update the color panel");
        }

        setColorPanels(state => ({
            ...state,
            [panelId]: {
                ...state[panelId],
                colors: {
                    ...state[panelId].colors,
                    [color]: name,
                }
            },
        }));
    };
    const changeColorInPanel = (panelId: string, color: string, oldColor: string) => {
        if (!(panelId in colorPanels)) {
            throw new Error(PANEL_404);
        }

        setColorPanels(state => {
            const copy = { ...state };

            const value = copy[panelId].colors[oldColor];

            delete copy[panelId].colors[oldColor];

            copy[panelId].colors[color] = value;

            return (copy);
        })
    };
    const deleteColorInPanel = (panelId: string, color: string) => {
        if (!(panelId in colorPanels)) {
            throw new Error(PANEL_404);
        }

        setColorPanels(state => {
            const copy = { ...state };

            delete copy[panelId].colors[color];

            return (copy);
        })
    };

    const value = {
        addColorInPanel,
        changeColorInPanel,
        colorPanels,
        createPanel,
        deleteColorInPanel,
        deletePanel,
        updatePanel,
    };

    return (
        <ColorPanelsContext.Provider value={value}>
            {props.children}
        </ColorPanelsContext.Provider>
    );
};
