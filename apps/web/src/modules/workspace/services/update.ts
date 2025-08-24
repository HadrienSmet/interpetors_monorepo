import { call, HTTP_METHODS } from "@/utils";

import { Workspace } from "../types";

import { ROUTE } from "./const";

export type UpdateParams = {
    readonly body: Omit<Partial<Workspace>, "id">;
    readonly id: string;
};
export const update = async ({ id, body }: UpdateParams) => {
    const response = await call<Workspace>({
        body,
        method: HTTP_METHODS.PATCH,
        route: `${ROUTE}/${id}`,
    });

    return (response);
};
