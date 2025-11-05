import { call, HTTP_METHODS } from "@/utils";
import { FolderNode } from "@repo/types";
import { getRoute } from "./const";

export const getAll = async (workspaceId: string, preparationId: string) => {
    const response = await call<Array<FolderNode>>({
        route: getRoute(workspaceId, preparationId),
        method: HTTP_METHODS.GET,
    });

    return (response);
};
