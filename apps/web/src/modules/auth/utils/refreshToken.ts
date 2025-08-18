import { AUTH } from "@/services";

import { AUTH_STORAGE_KEY, REFRESH_STORAGE_KEY } from "../const";

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_STORAGE_KEY);
    if (!refreshToken) return (null);

    const response = await AUTH.refreshAccess({ refreshToken });

    if (!response.ok) return (null);

    const tokenStr = await response.text();
    const tokens = JSON.parse(tokenStr);

    if (
        "access_token" in tokens &&
        "refresh_token" in tokens
    ) {
        localStorage.setItem(AUTH_STORAGE_KEY, tokens.access_token);
        localStorage.setItem(REFRESH_STORAGE_KEY, tokens.refresh_token);

        return (tokens.access_token);
    }

    return (null);
};
