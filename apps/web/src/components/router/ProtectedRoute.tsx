import { PropsWithChildren } from "react";
import { Navigate } from "react-router";

import { useAuth } from "@/modules";
import { WorkSpaceWrapper } from "@/wrappers";

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
        <WorkSpaceWrapper>
            {children}
        </WorkSpaceWrapper>
    );
};
