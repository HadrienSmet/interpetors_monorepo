import { call, HTTP_METHODS } from "@/utils";

import { ColorPanelType, CreateColorPanelParams } from "../types";

import { ROUTE } from "./const";

export const create = async (params: CreateColorPanelParams) => {
    const response = await call<ColorPanelType>({
        body: params,
        method: HTTP_METHODS.POST,
        route: ROUTE,
    });

    return (response);
};
