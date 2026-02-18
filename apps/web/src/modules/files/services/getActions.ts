import { call, HTTP_METHODS } from "@/utils";

import { getPdfRoute } from "./const";

const getRoute = (preparationId: string, fileId: string) => `${getPdfRoute(preparationId)}/${fileId}/actions`;

type GetActionsOutput = {
	readonly actions: string;
	readonly fileId: string;
};
export const getActions = async (preparationId: string, fileId: string) => {
	const response = await call<GetActionsOutput>({
		route: getRoute(preparationId, fileId),
		method: HTTP_METHODS.GET,
	});

	return (response);
};
