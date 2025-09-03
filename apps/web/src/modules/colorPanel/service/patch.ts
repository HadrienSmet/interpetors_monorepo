import { call, HTTP_METHODS } from "@/utils";

import { ColorPanelType } from "../types";

import { ROUTE } from "./const";

export const patch = async (params: ColorPanelType) => {
    const response = await call<ColorPanelType>({
        body: params,
        method: HTTP_METHODS.PATCH,
        route: `${ROUTE}/${params.id}`
    });

    return (response);
};
