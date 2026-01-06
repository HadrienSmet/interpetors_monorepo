import { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router";

import { Loader } from "@/components";
import { useLocalePath } from "@/modules/router";

import { useWorkspaces, WorkspacesProvider } from "../context";

const WorkspaceWrapperChild = (props: PropsWithChildren) => {
    const localePath = useLocalePath();
    const location = useLocation();
    const { currentWorkspace, isReady } = useWorkspaces();

    if (!isReady) {
        return (<Loader />);
    }
    if (currentWorkspace === null && location.pathname !== localePath("workspace")) {
        return (<Navigate to={localePath("workspace")} />);
    }

    return (props.children);
};

export const WorkspaceWrapper = (props: PropsWithChildren) => {
    return (
        <WorkspacesProvider>
            <WorkspaceWrapperChild>
                {props.children}
            </WorkspaceWrapperChild>
        </WorkspacesProvider>
    );
};
