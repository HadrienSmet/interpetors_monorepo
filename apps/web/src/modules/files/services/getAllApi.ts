import { call, HTTP_METHODS } from "@/utils";

import { getPdfRoute } from "./const";

export type FileApiResponse = {
    readonly filePath: string;
    readonly id: string;
	readonly language: string | null;
    readonly name: string;
    readonly s3Key: string;
};
export const getAllApi = async (preparationId: string) => {
    const response = await call<Array<FileApiResponse>>({
        route: getPdfRoute(preparationId),
        method: HTTP_METHODS.GET,
    });

    return (response);
};
