import { createContext, ReactNode, useContext } from "react";

import { getContextError } from "../utils";
import { Position } from "@/types";

export type ContextMenuItemParams =  {
    readonly children: ReactNode;
    readonly onClick: () => void;
};
export type ContextMenuContextState = {
    readonly items: Array<ContextMenuItemParams>;
    readonly onBlur?: (() => void) | undefined;
    readonly position: Position;
};
export type ContextMenuContextValue =
    & ContextMenuContextState
    & {
        readonly setContextMenu: (position: Position, items: Array<ContextMenuItemParams>, onBlur?: () => void) => void;
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
