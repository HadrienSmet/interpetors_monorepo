import { call, HTTP_METHODS } from "@/utils";

import { Workspace } from "../types";

import { ROUTE } from "./const";

type GetOneWorkspaceParams = {
    readonly workspaceId: string;
};
export const getOne = async (params: GetOneWorkspaceParams) => {
    const response = await call<Workspace>({
        method: HTTP_METHODS.GET,
        route: `${ROUTE}/${params.workspaceId}`,
    });

    return (response);
};
