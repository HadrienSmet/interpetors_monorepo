import { AUTH_STORAGE_KEY, refreshAccessToken } from "@/modules/auth";

export const HTTP_METHODS = {
    GET: "GET",
    DELETE: "DELETE",
    PATCH: "PATCH",
    POST: "POST",
    PUT: "PUT",
} as const;
export type HttpMethod = typeof HTTP_METHODS[keyof typeof HTTP_METHODS];
type MethodWithBody =
    | typeof HTTP_METHODS.PATCH
    | typeof HTTP_METHODS.POST
    | typeof HTTP_METHODS.PUT;
type CallWithoutBodyParams = {
    readonly route: string;
    readonly method:
        | typeof HTTP_METHODS.DELETE
        | typeof HTTP_METHODS.GET;
};
type CallWithBodyParams = {
    readonly body: Record<string, any>;
    readonly method: MethodWithBody;
    readonly route: string;
};
type CallParams =
    (
        | CallWithoutBodyParams
        | CallWithBodyParams
    )
    & {
        readonly headers?: any;
        readonly skipRefresh?: boolean;
    };
type CallOutput<T> =
    | {
        readonly success: true;
        readonly data: T;
    }
    | {
        readonly success: false;
        readonly message: string
    }

const HEADERS = {
    "Content-Type": "application/json",
} as const;
export const call = async <T>({ skipRefresh = false, ...params}: CallParams): Promise<CallOutput<T>> => {
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

    if (
        params.method === HTTP_METHODS.PATCH ||
        params.method === HTTP_METHODS.POST ||
        params.method === HTTP_METHODS.PUT
    ) {
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

    if (response.ok) {
        const strData = await response.text();

        return ({
            success: true,
            data: JSON.parse(strData),
        });
    }

    return ({
        success: false,
        message: await response.text(),
    });
};
