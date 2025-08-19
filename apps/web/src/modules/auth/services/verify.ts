import { call, HTTP_METHODS } from "@/utils";

import { ROUTE } from "./const";

type VerifyAccessParams ={
    readonly accessToken: string;
};
type VerifiedSuccess = {
    readonly email: string;
    readonly userId: string;
};
export const verifyAccess = async (params: VerifyAccessParams) => {
    const response = await call<VerifiedSuccess>({
        headers: {
            Authorization: `Bearer ${params.accessToken}`,
        },
        method: HTTP_METHODS.GET,
        route: `${ROUTE}/verify`,
    });

    return (response);
};
