import { PropsWithChildren, useEffect, useState } from "react";

import { AUTH } from "@/services";

import { AUTH_STORAGE_KEY, REFRESH_STORAGE_KEY } from "../const";
import { refreshAccessToken } from "../utils";

import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [hasCheck, setHasCheck] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

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
                const response = await AUTH.verifyAccess({ accessToken });

                if (response.ok) {
                    setIsAuthenticated(true);
                    return;
                }
            }

            const newToken = await refreshAccessToken();
            if (newToken) {
                setIsAuthenticated(true);
                return;
            }

            signout();
        };

        if (!hasCheck) {
            checkToken();
            setHasCheck(true);
        }
    }, [hasCheck]);

    const value = {
        isAuthenticated,
        signin,
        signout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
