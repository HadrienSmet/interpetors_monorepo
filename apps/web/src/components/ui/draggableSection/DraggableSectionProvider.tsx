import { PropsWithChildren, useEffect, useMemo, useState } from "react";

import { DraggableSectionContext } from "./DraggableSectionContext";

export const DraggableSectionProvider = ({ children, defaultRotation }: PropsWithChildren & { defaultRotation: "row" | "column" }) => {
    const [isLandscape, setIsLandscape] = useState(false);
    const [isLeftSide, setIsLeftSide] = useState(true);
    const [isOpen, setIsOpen] = useState(true);
    const [isTopSide, setIsTopSide] = useState(true);

    const dynamicClass: "column" | "row" = useMemo(() => (isLandscape ? "row" : "column"), [isLandscape]);

    useEffect(() => {
        setIsLandscape(defaultRotation === "row");
    }, []);

    const value = {
        dynamicClass,
        isLandscape,
        isLeftSide,
        isOpen,
        isTopSide,
        setIsLandscape,
        setIsLeftSide,
        setIsOpen,
        setIsTopSide,
    };

    return (
        <DraggableSectionContext.Provider value={value}>
            {children}
        </DraggableSectionContext.Provider>
    );
};
