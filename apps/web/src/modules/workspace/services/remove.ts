import { call, HTTP_METHODS } from "@/utils";

import { Workspace } from "../types";

import { ROUTE } from "./const";

type RemoveParams = {
    readonly id: string;
};
export const remove = async (params: RemoveParams) => {
    const response = call<Workspace>({
        method: HTTP_METHODS.DELETE,
        route: `${ROUTE}/${params.id}`,
    });

    return (response);
};
