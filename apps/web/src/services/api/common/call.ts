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
    | GetParams
    | CallWithBodyParams;

const HEADERS = {
    "Content-Type": "application/json",
} as const;
export const call = async (params: CallParams) => {
    let requestInit: RequestInit = {
        headers: HEADERS,
        method: params.method,
    };

    if (params.method !== HTTP_METHODS.GET) {
        requestInit.body = JSON.stringify(params.body);
    }

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/${params.route}`,
        requestInit
    );

    return (response);
};
