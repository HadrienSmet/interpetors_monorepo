import { SavedVocabularyTerm } from "@repo/types";

import { call, HTTP_METHODS } from "@/utils";

import { getRoute } from "./const";

export const getAllFromPreparation = async (workspaceId: string, preparationId: string) => {
    const response = await call<Array<SavedVocabularyTerm>>({
        method: HTTP_METHODS.GET,
        route: getRoute(workspaceId, preparationId),
    });

    return (response);
};
export const getAllFromWorkspace = async (workspaceId: string) => {
    const response = await call<Array<SavedVocabularyTerm>>({
        method: HTTP_METHODS.GET,
        route: `workspaces/${workspaceId}/vocabulary`
    });

    return (response);
};
