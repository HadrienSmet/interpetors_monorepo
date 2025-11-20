import { call, HTTP_METHODS } from "@/utils";

import { ROUTE } from "./const";

type PatchBody = {
    readonly pageIndex: number;
    readonly elementsJson?: string;
    readonly referencesJson?: string;
    readonly generatedResourcesJson?: string;
};
type PatchParams = {
    readonly body: PatchBody;
    readonly pdfFileId: string;
};
export const patch = async ({ body, pdfFileId }: PatchParams) => {
    const response = await call({
        body,
        method: HTTP_METHODS.PATCH,
        route: `${ROUTE}/${pdfFileId}`,
    });

    return (response);
};
