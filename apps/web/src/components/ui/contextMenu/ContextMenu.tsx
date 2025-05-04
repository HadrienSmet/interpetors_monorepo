import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { ContextMenuItemParams, useContextMenu } from "@/contexts";

import "./contextMenu.scss";

export type ContextMenuItemProps = ContextMenuItemParams;
const ContextMenuItem = (props: ContextMenuItemProps) => {
    const { removeContextMenu } = useContextMenu();

    return (
        <div
            className="context-menu__item"
            onClick={() => {
                props.onClick();
                removeContextMenu();
            }}
        >
            {props.children}
        </div>
    );
};

export const ContextMenu = () => {
    const { position, items, removeContextMenu } = useContextMenu();
    const menuRef = useRef<HTMLDivElement>(null);

    const portalsRoot = document.getElementById("portals");

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                removeContextMenu();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [removeContextMenu]);

    if (
        (position.x < 0 && position.y < 0) ||
        !portalsRoot
    ) {
        return (null);
    }

    return (
        createPortal(
            <div
                className="context-menu"
                ref={menuRef}
                style={{
                    left: position.x,
                    top: position.y,
                }}
            >
                {items.map((item, index) => (
                    <ContextMenuItem key={`context-item-${index}`} {...item} />
                ))}
            </div>,
            portalsRoot
        )
    );
};
