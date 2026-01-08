import { PropsWithChildren, useEffect, useState } from "react";

import { base64ToUint8Array, deriveKey } from "@/utils";

import { AUTH_STORAGE_KEY, CRYPTO_SALT_STORAGE_KEY, REFRESH_STORAGE_KEY } from "../const";
import { verifyAccess } from "../services";
import { refreshAccessToken } from "../utils";

import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [hasCheck, setHasCheck] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [userKey, setUserKey] = useState<CryptoKey | null>(null);

    const signin = async (password: string) => {
        const cryptoSalt = localStorage.getItem(CRYPTO_SALT_STORAGE_KEY);

        if (!cryptoSalt) {
            throw new Error("No crypto salt stored")
        }
        const saltBytes = base64ToUint8Array(cryptoSalt);
        const key = await deriveKey(password, saltBytes);

        setUserKey(key);
        setIsAuthenticated(true);
    };
    const signout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(REFRESH_STORAGE_KEY);
        localStorage.removeItem(CRYPTO_SALT_STORAGE_KEY);
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
        isReady,
        signin,
        signout,
        userKey,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
