import { call, HTTP_METHODS } from "@/utils";

import { AuthTokens } from "../types";

import { ROUTE } from "./const";

type RefreshAccessParams ={
    readonly refreshToken: string;
};
export const refreshAccess = async (params: RefreshAccessParams) => {
    const response = await call<AuthTokens>({
        body: params,
        headers: {
            Authorization: `Bearer ${params.refreshToken}`,
        },
        method: HTTP_METHODS.POST,
        route: `${ROUTE}/refresh`,
        skipRefresh: true,
    });

    return (response);
};
