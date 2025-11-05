import { FileAction } from "@repo/types";

import { call, HTTP_METHODS } from "@/utils";

import { ApiFileActions } from "../types";

import { ROUTE } from "./const";

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

    const body: ApiFileActions = {
        pdfFileId: fileId,
        elementsJson: JSON.stringify(elements),
        generatedResourcesJson: JSON.stringify(generatedResources),
        pageIndex,
        referencesJson: JSON.stringify(references),
    };

    const response = await call({
        body,
        method: HTTP_METHODS.POST,
        route: ROUTE,
    });

    return (response);
};
