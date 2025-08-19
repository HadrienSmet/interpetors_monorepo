import { PropsWithChildren } from "react";

import { useWorkSpaces, WorkSpacesProvider } from "@/modules";
import { WorkSpaceCreator } from "@/views";

const WorkSpaceWrapperChild = (props: PropsWithChildren) => {
    const { currentWorkspace } = useWorkSpaces();

    if (!currentWorkspace) {
        return (<WorkSpaceCreator />);
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
