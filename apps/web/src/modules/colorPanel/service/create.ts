import { call, HTTP_METHODS } from "@/utils";

import { ColorPanelInCreation, ColorPanelType } from "../types";

import { ROUTE } from "./const";

type CreateColorPanelParams = 
	& ColorPanelInCreation 
	& { readonly workspaceId: string; };
export const create = async (params: CreateColorPanelParams) => {
    const response = await call<ColorPanelType>({
        body: params,
        method: HTTP_METHODS.POST,
        route: ROUTE,
    });

    return (response);
};
