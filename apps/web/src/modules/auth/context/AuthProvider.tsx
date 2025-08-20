import { PropsWithChildren, useEffect, useState } from "react";

import { AUTH_STORAGE_KEY, REFRESH_STORAGE_KEY } from "../const";
import { verifyAccess } from "../services";
import { refreshAccessToken } from "../utils";

import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [hasCheck, setHasCheck] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isReady, setIsReady] = useState(false);

    const signin = () => {
        setIsAuthenticated(true);
    };
    const signout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(REFRESH_STORAGE_KEY);
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
            checkToken()
                .then(() => setHasCheck(true));
        }
    }, [hasCheck]);

    const value = {
        isAuthenticated,
        isReady,
        signin,
        signout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
