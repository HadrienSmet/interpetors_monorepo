import { PropsWithChildren } from "react";
import { Navigate } from "react-router";

import { useAuth, WorkspaceWrapper } from "@/modules";

import { Loader } from "../ui";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
    const { isAuthenticated, isReady } = useAuth();

    if (!isReady) {
        return (<Loader />);
    }
    if (!isAuthenticated) {
        return (<Navigate to="/signin" />);
    }

    return (
        <WorkspaceWrapper>
            {children}
        </WorkspaceWrapper>
    );
};
