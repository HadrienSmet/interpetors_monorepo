import { call, CallOutput, HTTP_METHODS } from "@/utils";

import { getPdfRoute } from "./const";

export type PostPdfParams = {
    readonly actions: string;
    readonly filePath: string;
    readonly name: string;
    readonly preparationId: string;
    readonly s3Key: string;
};
// TODO: improve response typing
type PostPdfResponse = {
    readonly id: string;
};
export const postPdf = async (params: PostPdfParams): Promise<CallOutput<PostPdfResponse>> => {
    const { preparationId, ...body } = params;

    const response = await call<{ id: string; }>({
        body,
        method: HTTP_METHODS.POST,
        route: getPdfRoute(preparationId),
    });

    return (response);
};
