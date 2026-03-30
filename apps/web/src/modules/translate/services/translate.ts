import { call, HTTP_METHODS } from "@/utils";

const ROUTE = "translate";

type TranslateParams = {
	readonly origin: string;
	readonly targets: Array<string>;
	readonly text: string;
};
export const translate = async (params: TranslateParams) => {
	const response = await call<Record<string, string>>({
		body: params,
		method: HTTP_METHODS.POST,
		route: ROUTE,
	});

	return (response);
};
