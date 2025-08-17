import { createContext, useContext } from "react";

import { getContextError } from "@/contexts/utils";

type AuthContextType = {
    readonly isAuthenticated: boolean;
    readonly signin: () => void;
    readonly signout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);

    if (!ctx) {
        throw new Error(getContextError("useAuth", "AuthProvider"));
    }

    return (ctx);
};
