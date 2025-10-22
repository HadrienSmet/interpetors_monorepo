import { call, HTTP_METHODS } from "@/utils";

import { ROUTE } from "./const";

export const presignGetOne = async (key: string) => {
    const response = call<unknown>({
        method: HTTP_METHODS.GET,
        route: `${ROUTE}/presign-get/${key}`
    });

    return (response);
};
