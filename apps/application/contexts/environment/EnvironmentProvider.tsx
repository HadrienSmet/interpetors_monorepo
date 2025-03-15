import { PropsWithChildren, useMemo, useState } from "react";

import { EnvironmentContext, } from "./EnvironmentContext";
import { getDeviceInfo } from "./getters";
import { useDimensions } from "./hooks";

export const EnvironmentProvider = (props: PropsWithChildren) => {
    const [scrollValue, setScrollValue] = useState(0);
    const dimensions = useDimensions();
    const deviceInfo = getDeviceInfo();

    const scroll = useMemo(() => ({
        value: scrollValue,
        setter: setScrollValue,
    }), [scrollValue]);

    return (
        <EnvironmentContext.Provider value={{ dimensions, deviceInfo, scroll }}>
            {props.children}
        </EnvironmentContext.Provider>
    );
};
