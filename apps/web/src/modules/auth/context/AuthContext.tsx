import { createContext, useContext } from "react";

import { getContextError } from "@/contexts/utils";

type AuthContextType = {
    readonly isAuthenticated: boolean;
    readonly isLocked: boolean;
    readonly isReady: boolean;
    readonly signin: (password: string) => Promise<void>;
    readonly signout: () => void;
    readonly unlock: (password: string) => Promise<boolean>;
    readonly userKey: CryptoKey | null;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);

    if (!ctx) {
        throw new Error(getContextError("useAuth", "AuthProvider"));
    }

    return (ctx);
};
