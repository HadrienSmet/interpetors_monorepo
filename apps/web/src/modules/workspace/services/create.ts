import { call, HTTP_METHODS } from "@/utils";

import { Workspace } from "../types";

import { ROUTE } from "./const";

type CreateWorkspaceParams = {
    readonly languages: Array<string>;
    readonly name: string;
    readonly nativeLanguage: string;
};
export const create = async (params: CreateWorkspaceParams) => {
    const response = await call<Workspace>({
        body: params,
        method: HTTP_METHODS.POST,
        route: ROUTE,
    });

    return (response);
};
