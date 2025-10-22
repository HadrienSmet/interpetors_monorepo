import { call, CallOutput, HTTP_METHODS } from "@/utils";

import { getRoute } from "./const";

type CreatePreparationParams = {
    readonly body: { readonly title: string; };
    readonly workspaceId: string;
};
type CreatePreparationOutput = {
    readonly id: string;
    readonly title: string;
}
export const create = async ({ body, workspaceId }: CreatePreparationParams): Promise<CallOutput<CreatePreparationOutput>> => {
    const response = await call<CreatePreparationOutput>({
        body,
        method: HTTP_METHODS.POST,
        route: getRoute(workspaceId),
    });

    return (response);
};
