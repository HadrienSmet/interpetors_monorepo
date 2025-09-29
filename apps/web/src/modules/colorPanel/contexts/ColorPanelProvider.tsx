import { PropsWithChildren, useEffect, useState } from "react";

import { create, getOne, patch, remove } from "../service";
import { ColorPanelInCreation, ColorPanelType } from "../types";

import { ColorPanelContext } from "./ColorPanelContext";

const STORAGE_KEY = "colorPanelId";
export const ColorPanelProvider = (props: PropsWithChildren) => {
    const [colorPanel, setColorPanel] = useState<ColorPanelType | null>(null);
    const [hasFetched, setHasFetched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const storedItem = localStorage.getItem(STORAGE_KEY);

        if (!storedItem) {
            setHasFetched(true);
            return;
        }

        const fetchColorPanel = async (id: string) => {
            const response = await getOne(id);

            if (response.success) {
                setColorPanel(response.data);
            }

            setHasFetched(true);
        };

        fetchColorPanel(storedItem);
    }, []);

    const createPanel = async (params: ColorPanelInCreation) => {
        setIsLoading(true);
        const response = await create({
            ...params,
            name: params.name ?? "default",
        });

        if (!response.success) {
            console.error("An error occured during color panel creation. Error: ", response.message);
            return;
        }

        const { data } = response;

        localStorage.setItem(STORAGE_KEY, data.id);

        setColorPanel(data);
        setIsLoading(false);
    };
    const deletePanel = async (id: string) => {
        setIsLoading(true);
        const response = await remove(id);

        if (response.success) {
            setColorPanel(null);
            localStorage.removeItem(STORAGE_KEY);
        }

        setIsLoading(false);
    };
    /** Operates a PATCH operation on color panel record */
    const updatePanel = async (colorPanel: ColorPanelType) => {
        setIsLoading(true);
        const response = await patch(colorPanel);

        if (response.success) {
            setColorPanel(response.data);
        }

        setIsLoading(false);
    };

    const value = {
        colorPanel,
        createPanel,
        deletePanel,
        hasFetched,
        isLoading,
        updatePanel,
    };

    return (
        <ColorPanelContext.Provider value={value}>
            {props.children}
        </ColorPanelContext.Provider>
    );
};
