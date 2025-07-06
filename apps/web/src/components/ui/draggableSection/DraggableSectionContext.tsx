import { createContext, Dispatch, SetStateAction, useContext } from "react";

import { getContextError } from "@/contexts/utils";

export type DraggableSectionContextValue = {
    readonly dynamicClass: "column" | "row";
    readonly isLandscape: boolean;
    readonly isLeftSide: boolean;
    readonly isOpen: boolean;
    readonly isTopSide: boolean;
    readonly setIsLandscape: Dispatch<SetStateAction<boolean>>;
    readonly setIsLeftSide: Dispatch<SetStateAction<boolean>>;
    readonly setIsOpen: Dispatch<SetStateAction<boolean>>;
    readonly setIsTopSide: Dispatch<SetStateAction<boolean>>;
};

export const DraggableSectionContext = createContext<DraggableSectionContextValue | null>(null);

export const useDraggableSection = () => {
    const ctx = useContext(DraggableSectionContext);

    if (!ctx) {
        throw new Error(getContextError("useDraggableSection", "DraggableSectionProvider"));
    }

    return (ctx);
};
