import { call, HTTP_METHODS } from "@/utils";

import { ColorPanelType } from "../types";

import { ROUTE } from "./const";

export const remove = async (id: string) => {
    const response = await call<ColorPanelType>({
        method: HTTP_METHODS.DELETE,
        route: `${ROUTE}/${id}`,
    });

    return (response);
};
