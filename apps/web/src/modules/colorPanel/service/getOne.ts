import { call, HTTP_METHODS } from "@/utils";

import { ColorPanelType } from "../types";

import { ROUTE } from "./const";

export const getOne = async (id: string) => {
    const response = await call<ColorPanelType>({
        method: HTTP_METHODS.GET,
        route: `${ROUTE}/${id}`,
    });

    return (response);
};
