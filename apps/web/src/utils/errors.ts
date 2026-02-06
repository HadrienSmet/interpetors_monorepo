import { safeJsonParse } from "./json";

type ServerError = {
	readonly error: string;
	readonly message: string;
	readonly statusCode: number;
};
export const handleError = (message: string) => {
	const error = safeJsonParse<ServerError>(message);

	return (error.message);
};
