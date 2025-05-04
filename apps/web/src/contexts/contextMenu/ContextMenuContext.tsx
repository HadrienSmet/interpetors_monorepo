import { createContext, ReactNode, useContext } from "react";

import { getContextError } from "../utils";

// Should be located somewhere like packages/client/types
export type Position = {
    readonly x: number;
    readonly y: number;
};
export type ContextMenuContextState = {
    readonly items: Array<ReactNode>;
    readonly position: Position;
};
export type ContextMenuContextValue =
    & ContextMenuContextState
    & {
        readonly setContextMenu: (position: Position, items: Array<ReactNode>) => void;
        readonly removeContextMenu: () => void;
    };

export const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

export const useContextMenu = () => {
    const context = useContext(ContextMenuContext);

    if (!context) {
        throw new Error(getContextError("useContextMenu", "ContextMenuProvider"));
    }

    return (context);
};
