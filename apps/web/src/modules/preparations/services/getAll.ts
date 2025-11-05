import { call, HTTP_METHODS } from "@/utils";

import { PreparationItem } from "../types";

import { getRoute } from "./const";

export const getAll = async (workspaceId: string) => {
    const response = await call<Array<PreparationItem>>({
        method: HTTP_METHODS.GET,
        route: getRoute(workspaceId),
    });

    return (response);
};
