import { call, HTTP_METHODS } from "@/utils";

import { getRoute } from "./const";

type PatchParams = {
    readonly preparationId: string;
    readonly title: string;
    readonly workspaceId: string;
};
export const patch = async ({ preparationId, title, workspaceId }: PatchParams) => {
    const response = await call({
        route: `${getRoute(workspaceId)}/${preparationId}`,
        method: HTTP_METHODS.PATCH,
        body: { title },
    });

    return (response);
};
