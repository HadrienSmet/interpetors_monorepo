import { ActionColor, VocabularyOccurence } from "@repo/types";

import { call, HTTP_METHODS } from "@/utils";

import { getRoute } from "./const";

export type PostBulkTerm = {
    readonly color: ActionColor;
    readonly translations: Array<string>;
    readonly occurence:
        & { readonly pdfFileId: string; }
        & VocabularyOccurence;
};
type PostBulkParams = {
    readonly workspaceId: string;
    readonly preparationId: string;
    readonly terms: Array<PostBulkTerm>;
};
export const postBulk = async (params: PostBulkParams) => {
    const {
        preparationId,
        terms,
        workspaceId,
    } = params;

    const response = await call({
        body: {
            terms: terms.map(term => {
                const output = {
                    colorJson: term.color,
                    occurence: term.occurence,
                    translations: term.translations,
                };

                return (output);
            })
        },
        method: HTTP_METHODS.POST,
        route: `${getRoute(workspaceId, preparationId)}/bulk`,
    });

    return (response);
};
