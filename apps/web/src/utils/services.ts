import { AUTH_STORAGE_KEY, refreshAccessToken } from "@/modules/auth";

export const HTTP_METHODS = {
    GET: "GET",
    DELETE: "DELETE",
    PATCH: "PATCH",
    POST: "POST",
    PUT: "PUT",
} as const;
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
export type CallOutput<T> =
    | {
        readonly data: T;
        readonly success: true;
    }
    | {
        readonly message: string;
        readonly success: false;
    };

const HEADERS = {
    "Content-Type": "application/json",
} as const;
export const call = async <T>({ skipRefresh = false, ...params }: CallParams): Promise<CallOutput<T>> => {
    let token = localStorage.getItem(AUTH_STORAGE_KEY);

    let requestInit: RequestInit = {
        headers: {
            ...HEADERS,
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        method: params.method,
    };

    if (params.headers) {
        requestInit.headers = {
            ...requestInit.headers,
            ...params.headers,
        };
    }

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
            );
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

export const handleServicesConcurrency = (limit: number) => {
    let active = 0;
    const queue: Array<() => void> = [];

    const next = () => {
        active--;
        if (queue.length > 0) queue.shift()!();
    };

    return async <T>(fn: () => Promise<T>): Promise<T> => {
        if (active >= limit) {
            await new Promise<void>((resolve) => queue.push(resolve));
        }
        active++;
        try {
            return (await fn());
        } finally {
            next();
        }
    };
};
