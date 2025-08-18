import { AUTH_STORAGE_KEY, refreshAccessToken } from "@/modules";

export const HTTP_METHODS = {
    GET: "GET",
    PATCH: "PATCH",
    POST: "POST",
    PUT: "PUT",
} as const;
export type HttpMethod = typeof HTTP_METHODS[keyof typeof HTTP_METHODS];
type MethodWithBody =
    | typeof HTTP_METHODS.PATCH
    | typeof HTTP_METHODS.POST
    | typeof HTTP_METHODS.PUT;
type GetParams = {
    readonly route: string;
    readonly method: typeof HTTP_METHODS.GET;
};
type CallWithBodyParams = {
    readonly route: string;
    readonly method: MethodWithBody;
    readonly body: Record<string, any>;
};
type CallParams =
    (
        | GetParams
        | CallWithBodyParams
    )
    & {
        readonly headers?: any;
        readonly skipRefresh?: boolean;
    };

const HEADERS = {
    "Content-Type": "application/json",
} as const;
export const call = async ({ skipRefresh = false, ...params}: CallParams) => {
    let token = localStorage.getItem(AUTH_STORAGE_KEY);

    let requestInit: RequestInit = {
        headers: params.headers
            ? {
                ...HEADERS,
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...params.headers,
            }
            : HEADERS,
        method: params.method,
    };

    if (params.method !== HTTP_METHODS.GET) {
        requestInit.body = JSON.stringify(params.body);
    }

    let response = await fetch(
        `${import.meta.env.VITE_API_URL}/${params.route}`,
        requestInit
    );

    // Checking if can be succeeded with new token
    if ((response.status === 401 || response.status === 403) && !skipRefresh) {
        token = await refreshAccessToken();

        if (token) {
            response = await fetch(
               `${import.meta.env.VITE_API_URL}/${params.route}`,
                {
                    ...requestInit,
                    headers: {
                        ...requestInit.headers,
                        Authorization: `Bearer ${token}`,
                    }
                }
            )
        }
    }

    return (response);
};
