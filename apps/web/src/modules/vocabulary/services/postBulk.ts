import { SavedVocabularyTerm } from "@repo/types";

import { call, HTTP_METHODS } from "@/utils";

import { getRoute } from "./const";

type PostBulkParams = {
    readonly preparationId: string;
    readonly terms: Array<SavedVocabularyTerm>;
    readonly workspaceId: string;
};
export const postBulk = async (params: PostBulkParams) => {
    const {
        preparationId,
        terms,
        workspaceId,
    } = params;

    const body = {
        terms: terms.map(term => ({
            colorJson: term.color,
            occurrence: term.occurrence,
            translations: term.translations,
        })),
    };
    const response = await call({
        body,
        method: HTTP_METHODS.POST,
        route: `${getRoute(workspaceId, preparationId)}/bulk`,
    });

    return (response);
};
