import { PropsWithChildren, useEffect, useState } from "react";

import { LOCAL_STORAGE } from "@/utils";

import { create, getOne, patch, remove } from "../service";
import { ColorPanelInCreation, ColorPanelType } from "../types";

import { ColorPanelContext } from "./ColorPanelContext";

export const ColorPanelProvider = (props: PropsWithChildren) => {
    const [colorPanel, setColorPanel] = useState<ColorPanelType | null>(null);
    const [hasFetched, setHasFetched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const storedItem = localStorage.getItem(LOCAL_STORAGE.coloPanel);

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

    const createPanel = async (params: ColorPanelInCreation & { readonly workspaceId: string }) => {
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

        localStorage.setItem(LOCAL_STORAGE.coloPanel, data.id);

        setColorPanel(data);
        setIsLoading(false);
    };
    const deletePanel = async (id: string) => {
        setIsLoading(true);
        const response = await remove(id);

        if (response.success) {
            setColorPanel(null);
            localStorage.removeItem(LOCAL_STORAGE.coloPanel);
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
