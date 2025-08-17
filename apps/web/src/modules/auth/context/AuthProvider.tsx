import { PropsWithChildren, useEffect, useState } from "react";

import { AuthContext } from "./AuthContext";

export const AUTH_STORAGE_KEY = "authToken";
export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const signin = () => {
        setIsAuthenticated(true);
    }
    const signout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem(AUTH_STORAGE_KEY);
    };

    useEffect(() => {
        setIsAuthenticated(localStorage.getItem(AUTH_STORAGE_KEY) !== null)
    }, []);

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
