import { call, CallOutput, HTTP_METHODS } from "@/utils";

import { getRoute } from "./const";

export type CreateFolderParams = {
    readonly name: string;
    readonly parentId?: string;
    readonly preparationId: string;
    readonly workspaceId: string;
};
type CreateFoldersOutput = {
    readonly name: string;
    readonly id: string;
};
export const create = async (params: CreateFolderParams): Promise<CallOutput<CreateFoldersOutput>> => {
    const { preparationId, workspaceId, ...body } = params;
    const response = await call<CreateFoldersOutput>({
        body,
        method: HTTP_METHODS.POST,
        route: getRoute(workspaceId, preparationId),
    });

    return (response);
};
