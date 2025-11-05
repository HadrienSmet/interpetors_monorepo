import { call, HTTP_METHODS } from "@/utils";

import { FetchedFileActions } from "../types";

import { ROUTE } from "./const";

export const getAll = async (fileId: string) => {
    const response = await call<Array<FetchedFileActions>>({
        route: `${ROUTE}/${fileId}`,
        method: HTTP_METHODS.GET,
    });

    return (response);
};
