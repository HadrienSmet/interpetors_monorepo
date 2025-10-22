import { call, CallOutput, HTTP_METHODS } from "@/utils";

import { getPdfRoute } from "./const";

export type PostPdfParams = {
    readonly filePath: string;
    readonly folderId: string;
    readonly name: string;
};
// TODO: improve response typing
type PostPdfResponse = {
    readonly id: string;
};
export const postPdf = async (params: PostPdfParams): Promise<CallOutput<PostPdfResponse>> => {
    const { folderId, ...body } = params;

    const response = await call<{ id: string; }>({
        body,
        method: HTTP_METHODS.POST,
        route: getPdfRoute(folderId),
    });

    return (response);
};
