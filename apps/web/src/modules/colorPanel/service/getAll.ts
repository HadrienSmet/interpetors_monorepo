import { call, HTTP_METHODS } from "@/utils";

import { ColorPanelType } from "../types";

import { ROUTE } from "./const";

export const getAll = async () => {
    const response = await call<Array<ColorPanelType>>({
        method: HTTP_METHODS.GET,
        route: ROUTE,
    });

    return (response);
};
