import { PropsWithChildren } from "react";

import { Loader } from "@/components";

import { ColorPanelProvider, useColorPanel } from "../contexts";

const ColorPanelWrapperChild = (props: PropsWithChildren) => {
    const { hasFetched } = useColorPanel();

    if (!hasFetched) {
        return (<Loader />);
    }

    return (props.children);
};

export const ColorPanelWrapper = (props: PropsWithChildren) => (
    <ColorPanelProvider>
        <ColorPanelWrapperChild>
            {props.children}
        </ColorPanelWrapperChild>
    </ColorPanelProvider>
);
