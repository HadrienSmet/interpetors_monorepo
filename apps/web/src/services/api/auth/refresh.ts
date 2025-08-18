import { call, HTTP_METHODS } from "../common";
import { ROUTE } from "./const";

type RefreshAccessParams ={
    readonly refreshToken: string;
}
export const refreshAccess = async (params: RefreshAccessParams) => {
    const response = await call({
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
