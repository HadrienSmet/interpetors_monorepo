import { VocabularyTerm } from "@repo/types";

import { call, HTTP_METHODS } from "@/utils";

import { getRoute } from "./const";

export const getAllFromPreparation = async (workspaceId: string, preparationId: string) => {
    const response = await call<Array<VocabularyTerm>>({
        route: getRoute(workspaceId, preparationId),
        method: HTTP_METHODS.GET,
    });

    return (response);
};
