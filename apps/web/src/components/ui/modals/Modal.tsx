import { PropsWithChildren, useEffect } from "react";
import { createPortal } from "react-dom";

import "./modal.scss";

type ModalProps =
    & {
        readonly isOpen: boolean;
        readonly minWidth?: string;
        readonly onClose: () => void;
        readonly persistant?: boolean;
        readonly width?: string;
    }
    & PropsWithChildren;

export const Modal = ({ children, isOpen, minWidth = undefined, onClose, persistant = false, width = "75%" }: ModalProps) => {
    const portalRoot = document.getElementById("portals");

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
        }

        return () => {
            document.removeEventListener("keydown", handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !portalRoot) return (null);

    return createPortal(
        <div
            className="modal-overlay"
            onClick={persistant ? () => null : onClose}
        >
            <div
                className="modal"
                onClick={(e) => e.stopPropagation()}
                style={{ minWidth, width }}
            >
                {children}
            </div>
        </div>,
        portalRoot
    );
};
