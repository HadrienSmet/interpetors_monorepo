import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { useContextMenu } from "@/contexts";

import "./contextMenu.scss";

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
                    <div
                        className="context-menu__item"
                        key={`context-menu__item-${index}`}
                    >
                        {item}
                    </div>
                ))}
            </div>,
            portalsRoot
        )
    );
};
