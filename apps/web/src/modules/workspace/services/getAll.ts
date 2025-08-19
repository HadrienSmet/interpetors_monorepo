import { call, HTTP_METHODS } from "@/utils";

import { Workspace } from "../types";

import { ROUTE } from "./const";

export const getAll = async () => {
    const response = await call<Array<Workspace>>({
        method: HTTP_METHODS.GET,
        route: `${ROUTE}`,
    });

    return (response);
};
