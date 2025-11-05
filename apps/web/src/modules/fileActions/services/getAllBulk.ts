import { call, HTTP_METHODS } from "@/utils";

import { FetchedFileActions } from "../types";

import { ROUTE } from "./const";

export type GetBulkResponse = Record<string, Array<FetchedFileActions>>;
export const getAllBulk = async (pdfFileIds: Array<string>) => {
    const response = await call<GetBulkResponse>({
        route: `${ROUTE}/bulk`,
        method: HTTP_METHODS.POST,
        body: { pdfFileIds },
    });

    return (response);
};
