import { PropsWithChildren, useEffect, useState } from "react";

import { base64ToUint8Array, deriveKey, LOCAL_STORAGE } from "@/utils";

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
        const userId = localStorage.getItem(LOCAL_STORAGE.userId);
        if (!userId) {
            throw new Error("No user id stored");
        }

        const response = await callUnlock({ password, userId });
        const isPasswordValid = response.success
            ? response.data.isPasswordValid
            : false;
        if (isPasswordValid) {
            const cryptoSalt = localStorage.getItem(LOCAL_STORAGE.cryptoSalt);
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
        localStorage.removeItem(LOCAL_STORAGE.token);
        localStorage.removeItem(LOCAL_STORAGE.refresh);
        localStorage.removeItem(LOCAL_STORAGE.cryptoSalt);
        localStorage.removeItem(LOCAL_STORAGE.userId);
		localStorage.removeItem(LOCAL_STORAGE.workspace);
    };

    useEffect(() => {
        const checkToken = async () => {
            const accessToken = localStorage.getItem(LOCAL_STORAGE.token);
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
