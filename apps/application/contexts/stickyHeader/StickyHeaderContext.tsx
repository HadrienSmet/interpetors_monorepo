import { createContext, Dispatch, SetStateAction, useContext } from "react";

import { getContextError } from "../messageError";

type StickyHeaderContextType = {
    hasToRenderSticky: boolean;
    setRenderSticky: Dispatch<SetStateAction<boolean>>;
};

export const StickyHeaderContext = createContext<StickyHeaderContextType | null>(null);

export const useStickyHeader = () => {
    const value = useContext(StickyHeaderContext);

    if (!value) {
        throw new Error(getContextError("useStickyHeader", "StickyHeaderProvider"));
    }

    return (value);
};