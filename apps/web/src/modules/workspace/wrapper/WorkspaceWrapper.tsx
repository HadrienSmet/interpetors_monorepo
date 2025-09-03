import { PropsWithChildren } from "react";
import { Navigate } from "react-router";

import { Loader } from "@/components";

import { useWorkspaces, WorkspacesProvider } from "../context";

const WorkspaceWrapperChild = (props: PropsWithChildren) => {
    const { currentWorkspace, isReady } = useWorkspaces();

    if (!isReady) {
        return (<Loader />);
    }
    if (currentWorkspace === null) {
        return (<Navigate to="/workspace" />);
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
