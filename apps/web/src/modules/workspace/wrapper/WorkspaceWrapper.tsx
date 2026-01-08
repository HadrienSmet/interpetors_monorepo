import { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router";

import { Loader } from "@/components";
import { useLocalePath } from "@/modules/router";

import { useWorkspaces } from "../context";

export const WorkspaceWrapper = (props: PropsWithChildren) => {
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
