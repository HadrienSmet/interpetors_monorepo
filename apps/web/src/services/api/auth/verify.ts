import { call, HTTP_METHODS } from "../common";

import { ROUTE } from "./const";

type VerifyAccessParams ={
    readonly accessToken: string;
};
export const verifyAccess = async (params: VerifyAccessParams) => {
    const response = await call({
        headers: {
            Authorization: `Bearer ${params.accessToken}`,
        },
        method: HTTP_METHODS.GET,
        route: `${ROUTE}/verify`,
    });

    return (response);
};
