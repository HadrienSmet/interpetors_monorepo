import { PropsWithChildren } from "react";

import { useWorkSpaces, WorkSpacesProvider } from "@/contexts";
import { WorkSpaceCreator } from "@/views";

const WorkSpaceWrapperChild = (props: PropsWithChildren) => {
    const { currentWorkSpace } = useWorkSpaces();

    if (!currentWorkSpace) {
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
