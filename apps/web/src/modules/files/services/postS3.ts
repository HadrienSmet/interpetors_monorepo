import { call, HTTP_METHODS } from "@/utils";

import { ROUTE } from "./const";

export type PresignPostFileParams = {
    readonly contentType: string;
    readonly fileName: string;
};
type PresignPostFileOutput = {
    readonly headers: { readonly "Content-Type": string; };
    readonly key: string;
    readonly s3Uri: string;
    readonly url: string;
};
export const presignPostFile = async (params: PresignPostFileParams) => {
    const response = await call<PresignPostFileOutput>({
        body: params,
        method: HTTP_METHODS.POST,
        route: `${ROUTE}/presign-put-pdf`,
    });

    return (response);
};
