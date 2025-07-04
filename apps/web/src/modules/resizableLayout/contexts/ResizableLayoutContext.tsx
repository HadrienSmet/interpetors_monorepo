import { createContext, useContext } from "react";

import { getContextError } from "@/contexts/utils";

export type SectionId = string;

export type Section = {
    readonly id: SectionId;
    readonly minWidth: number;
    readonly width: number;
};
type ResizableLayoutContextType = {
    registerSection: (id: SectionId, initialWidth: number, minWidth: number) => void;
    rightMinSpace: number;
    sections: Record<SectionId, Section>;
    totalAvailableWidth: number;
    updateWidth: (id: SectionId, delta: number) => void;
};

export const ResizableLayoutContext = createContext<ResizableLayoutContextType | null>(null);

export const useResizableLayout = () => {
    const ctx = useContext(ResizableLayoutContext);

    if (!ctx) throw new Error(getContextError("useResizableLayout", "ResizableLayoutProvider"));

    return (ctx);
};
