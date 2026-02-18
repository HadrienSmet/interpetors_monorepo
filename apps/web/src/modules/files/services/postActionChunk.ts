import { call, CallOutput, HTTP_METHODS, UploadChunk } from "@/utils";

import { getPdfRoute } from "./const";

const getRoute = (prepId: string, fileId: string) => (`${getPdfRoute(prepId)}/${fileId}/actions/chunk`);
type PostActionParams = {
	readonly body: UploadChunk;
	readonly fileId: string;
	readonly preparationId: string;
}
type PostActionOutput =
	| { readonly completed: true }
	| { readonly received: number; readonly total: number; };
export const postActionChunk = async ({ body, fileId, preparationId }: PostActionParams): Promise<CallOutput<PostActionOutput>> => {
	const response = await call<PostActionOutput>({
		body,
		method: HTTP_METHODS.POST,
		route: getRoute(preparationId, fileId),
	});

	return (response);
};
