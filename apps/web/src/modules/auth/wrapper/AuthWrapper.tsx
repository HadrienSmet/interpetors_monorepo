import { PropsWithChildren } from "react";

import { UnAuthScreen } from "@/views";

import { useAuth } from "../context";

export const AuthWrapper = ({ children }: PropsWithChildren) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (<UnAuthScreen />);
    }

    return (children);
};
