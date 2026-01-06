import { PropsWithChildren } from "react";
import { Navigate } from "react-router";

import { Loader } from "@/components";
import { useAuth } from "@/modules/auth";
import { PreparationsProvider } from "@/modules/preparations";
import { DictionaryProvider } from "@/modules/vocabulary";
import { WorkspaceWrapper } from "@/modules/workspace";

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
            <PreparationsProvider>
                <DictionaryProvider>
                    {children}
                </DictionaryProvider>
            </PreparationsProvider>
        </WorkspaceWrapper>
    );
};
