import { PropsWithChildren, useState } from "react";

import { StickyHeaderContext } from "./StickyHeaderContext";

export const StickyHeaderProvider = (props: PropsWithChildren) => {
    const [hasToRenderSticky, setRenderSticky] = useState(false);

    return (
        <StickyHeaderContext.Provider value={{ hasToRenderSticky, setRenderSticky }}>
            {props.children}
        </StickyHeaderContext.Provider>
    );
}; 