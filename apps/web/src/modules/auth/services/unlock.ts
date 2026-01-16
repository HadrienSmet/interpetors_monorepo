import { call, HTTP_METHODS } from "@/utils";

import { ROUTE } from "./const";

type UnlockParams = {
    readonly password: string;
    readonly userId: string;
};
export const unlock = async (params: UnlockParams) => {
    const response = await call<{ isPasswordValid: boolean }>({
        route: `${ROUTE}/unlock`,
        method: HTTP_METHODS.POST,
        body: params,
    });

    return (response);
};
