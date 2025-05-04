import { PropsWithChildren, ReactNode, useState } from "react";

import { ContextMenuContext, ContextMenuContextState, Position } from "./ContextMenuContext";

const INITIAL_STATE = {
    position: { x: -1, y: -1 },
    items: [],
};

export const ContextMenuProvider = (props: PropsWithChildren) => {
    const [contextMenuState, setContextMenuState] = useState<ContextMenuContextState>({ ...INITIAL_STATE });

    const removeContextMenu = () => setContextMenuState({ ...INITIAL_STATE });
    const setContextMenu = (position: Position, items: Array<ReactNode>) => (
        setContextMenuState({
            position,
            items,
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
