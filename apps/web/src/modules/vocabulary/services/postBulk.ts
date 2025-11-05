import { ActionColor, VocabularyOccurence } from "@repo/types";

import { call, HTTP_METHODS } from "@/utils";

import { getRoute } from "./const";

export type PostBulkTerm = {
    readonly color: ActionColor;
    readonly occurrence:
        & { readonly pdfFileId: string; }
        & VocabularyOccurence;
    readonly translations: Array<string>;
};
type PostBulkParams = {
    readonly preparationId: string;
    readonly terms: Array<PostBulkTerm>;
    readonly workspaceId: string;
};
export const postBulk = async (params: PostBulkParams) => {
    const {
        preparationId,
        terms,
        workspaceId,
    } = params;

    const response = await call({
        body: {
            terms: terms.map(term => ({
                colorJson: term.color,
                occurrence: term.occurrence,
                translations: term.translations,
            })),
        },
        method: HTTP_METHODS.POST,
        route: `${getRoute(workspaceId, preparationId)}/bulk`,
    });

    return (response);
};
