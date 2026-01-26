import { PdfFileApi } from "@repo/types";

import { call, HTTP_METHODS } from "@/utils";

import { getPdfRoute } from "./const";

type PatchOneApiBody = {
    readonly filePath?: string;
    readonly name?: string;
};
type PatchOneApiParams = {
    readonly body: PatchOneApiBody;
    readonly fileId: string;
    readonly preparationId: string;
};
export const patchOneApi = async ({ body, fileId, preparationId }: PatchOneApiParams) => {
    const response = await call<PdfFileApi>({
        body,
        method: HTTP_METHODS.PATCH,
        route: `${getPdfRoute(preparationId)}/${fileId}`,
    });

    return (response);
};

export type FileToPatch = {
    actions?: string;
    filePath?: string;
    readonly id: string;
	name?: string;
};
type PatchApiParams = {
    readonly preparationId: string;
    readonly body: { files: Array<FileToPatch> };
};
export const patchApi = async ({ body, preparationId }: PatchApiParams) => {
    const response = await call<Array<PdfFileApi>>({
        body,
        method: HTTP_METHODS.PATCH,
        route: getPdfRoute(preparationId),
    });

    return (response);
};
