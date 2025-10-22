import { FileAction } from "@repo/types";

import { call, HTTP_METHODS } from "@/utils";

import { getRoute } from "./const";

export type PostFileActionParams =
    & {
        readonly fileId: string;
        readonly pageIndex: number;
    }
    & FileAction;
export const post = async (params: PostFileActionParams) => {
    const {
        elements,
        fileId,
        generatedResources,
        pageIndex,
        references,
    } = params;

    const body = {
        elementsJson: JSON.stringify(elements),
        generatedResourcesJson: JSON.stringify(generatedResources),
        pageIndex,
        referencesJson: JSON.stringify(references),
    };

    const response = await call({
        body,
        method: HTTP_METHODS.POST,
        route: getRoute(fileId),
    });

    return (response);
};
