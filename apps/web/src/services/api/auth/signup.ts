import { call, HTTP_METHODS } from "../common";

import { ROUTE } from "./const";

type SigninParams = {
    readonly email: string;
    readonly password: string;
};
export const signup = async (params: SigninParams) => {
    const response = await call({
        route: `${ROUTE}/signup`,
        method: HTTP_METHODS.POST,
        body: params
    });

    return (response);
};
