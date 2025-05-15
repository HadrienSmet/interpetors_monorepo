import { PropsWithChildren, useState } from "react";

import { Position } from "@/types";

import { ContextMenuContext, ContextMenuContextState, ContextMenuItemParams } from "./ContextMenuContext";

const INITIAL_STATE = {
    items: [],
    position: { x: -1, y: -1 },
};

export const ContextMenuProvider = (props: PropsWithChildren) => {
    const [contextMenuState, setContextMenuState] = useState<ContextMenuContextState>({ ...INITIAL_STATE });

    const removeContextMenu = () => {
        if (contextMenuState.onBlur) {
            contextMenuState.onBlur();
        }

        setContextMenuState({ ...INITIAL_STATE });
    };
    const setContextMenu = (position: Position, items: Array<ContextMenuItemParams>, onBlur?: () => void) => (
        setContextMenuState({
            items,
            onBlur,
            position,
        })
    );

    return (
        <ContextMenuContext
            value={{
                ...contextMenuState,
                removeContextMenu,
                setContextMenu,
            }}
        >
            {props.children}
        </ContextMenuContext>
    );
};
