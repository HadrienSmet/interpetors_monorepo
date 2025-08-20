import { PropsWithChildren } from "react";
import { Navigate } from "react-router";

import { Loader } from "@/components";
import { useWorkSpaces, WorkSpacesProvider } from "@/modules";

const WorkSpaceWrapperChild = (props: PropsWithChildren) => {
    const { currentWorkspace, isReady } = useWorkSpaces();

    if (!isReady) {
        return (<Loader />);
    }
    if (currentWorkspace === null) {
        return (<Navigate to="/workspace" />);
    }

    return (props.children);
};

export const WorkSpaceWrapper = (props: PropsWithChildren) => {
    return (
        <WorkSpacesProvider>
            <WorkSpaceWrapperChild>
                {props.children}
            </WorkSpaceWrapperChild>
        </WorkSpacesProvider>
    );
};
