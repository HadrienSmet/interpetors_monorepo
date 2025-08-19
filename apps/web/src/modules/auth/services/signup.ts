import { call, HTTP_METHODS } from "@/utils";

import { AuthTokens } from "../types";

import { ROUTE } from "./const";

type SigninParams = {
    readonly email: string;
    readonly password: string;
};
export const signup = async (params: SigninParams) => {
    const response = await call<AuthTokens>({
        route: `${ROUTE}/signup`,
        method: HTTP_METHODS.POST,
        body: params,
    });

    return (response);
};
