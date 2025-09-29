import { call, HTTP_METHODS } from "@/utils";

import { ColorPanelInCreation, ColorPanelType } from "../types";

import { ROUTE } from "./const";

export const create = async (params: ColorPanelInCreation) => {
    const response = await call<ColorPanelType>({
        body: params,
        method: HTTP_METHODS.POST,
        route: ROUTE,
    });

    return (response);
};
