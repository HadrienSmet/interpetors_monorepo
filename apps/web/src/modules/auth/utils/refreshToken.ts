import { LOCAL_STORAGE } from "@/utils";

import { refreshAccess } from "../services";

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem(LOCAL_STORAGE.refresh);
    if (!refreshToken) return (null);

    const response = await refreshAccess({ refreshToken });

    if (!response.success) return (null);

    const tokens = response.data;

    if (
        "access_token" in tokens &&
        "refresh_token" in tokens
    ) {
        localStorage.setItem(LOCAL_STORAGE.token, tokens.access_token);
        localStorage.setItem(LOCAL_STORAGE.refresh, tokens.refresh_token);
        localStorage.setItem(LOCAL_STORAGE.cryptoSalt, tokens.user.cryptoSalt);
        localStorage.setItem(LOCAL_STORAGE.userId, response.data.user.id);

        return (tokens.access_token);
    }

    return (null);
};
