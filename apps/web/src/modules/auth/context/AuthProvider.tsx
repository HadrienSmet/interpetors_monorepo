import { PropsWithChildren, useEffect, useState } from "react";

import { base64ToUint8Array, deriveKey } from "@/utils";

import { AUTH_STORAGE_KEY, CRYPTO_SALT_STORAGE_KEY, REFRESH_STORAGE_KEY, USER_ID_STORAGE_KEY } from "../const";
import { unlock as callUnlock, verifyAccess } from "../services";
import { refreshAccessToken } from "../utils";

import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [hasCheck, setHasCheck] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [userKey, setUserKey] = useState<CryptoKey | null>(null);

    useEffect(() => {
        if (isAuthenticated && userKey === null) {
            setIsLocked(true);
            return;
        }

        setIsLocked(false);
    }, [isAuthenticated, userKey]);
    const unlock = async (password: string) => {
        const userId = localStorage.getItem(USER_ID_STORAGE_KEY);
        if (!userId) {
            throw new Error("No user id stored");
        }

        const response = await callUnlock({ password, userId });
        const isPasswordValid = response.success
            ? response.data.isPasswordValid
            : false;
        if (isPasswordValid) {
            const cryptoSalt = localStorage.getItem(CRYPTO_SALT_STORAGE_KEY);
            if (!cryptoSalt) throw new Error("No crypto salt stored");

            const saltBytes = base64ToUint8Array(cryptoSalt);
            const key = await deriveKey(password, saltBytes);

            setUserKey(key);
        }

        return (isPasswordValid);
    };

    const signin = async (password: string) => {
        await unlock(password);
        setIsAuthenticated(true);
    };
    const signout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(REFRESH_STORAGE_KEY);
        localStorage.removeItem(CRYPTO_SALT_STORAGE_KEY);
        localStorage.removeItem(USER_ID_STORAGE_KEY);
    };

    useEffect(() => {
        const checkToken = async () => {
            const accessToken = localStorage.getItem(AUTH_STORAGE_KEY);
            if (accessToken) {
                const response = await verifyAccess({ accessToken });

                if (response.success) {
                    setIsAuthenticated(true);
                    setIsReady(true);
                    return;
                }
            }

            const newToken = await refreshAccessToken();
            if (newToken) {
                setIsAuthenticated(true);
            } else {
                signout();
            }

            setIsReady(true);
        };

        if (!hasCheck) {
            checkToken().then(() => setHasCheck(true));
        }
    }, [hasCheck]);

    const value = {
        isAuthenticated,
        isLocked,
        isReady,
        signin,
        signout,
        unlock,
        userKey,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
