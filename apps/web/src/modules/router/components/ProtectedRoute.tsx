import { PropsWithChildren } from "react";
import { Navigate } from "react-router";

import { Loader } from "@/components";
import { AppHeaderProvider } from "@/layout/header";
import { UnlockLayout, useAuth } from "@/modules/auth";
import { PreparationsProvider } from "@/modules/preparations";
import { DictionaryProvider } from "@/modules/vocabulary";
import { WorkspacesProvider, WorkspaceWrapper } from "@/modules/workspace";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
    const { isAuthenticated, isReady } = useAuth();

    if (!isReady) {
        return (<Loader />);
    }
    if (!isAuthenticated) {
        return (<Navigate to="/signin" />);
    }

    return (
		<AppHeaderProvider>
			<WorkspacesProvider>
				<WorkspaceWrapper>
					<PreparationsProvider>
						<DictionaryProvider>
							<UnlockLayout />
							{children}
						</DictionaryProvider>
					</PreparationsProvider>
				</WorkspaceWrapper>
			</WorkspacesProvider>
		</AppHeaderProvider>
    );
};
