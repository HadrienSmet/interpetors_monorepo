import { ReactNode, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { NavigationProps, NavigationState } from "./navigation.types";

type NavigationButtonProps =
    & {
        readonly buttonId: NavigationState;
        readonly icon: ReactNode;
    }
    & NavigationProps;

const SELECTED_CLASS = "selected";
export const NavigationButton = (props: NavigationButtonProps) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    const { t } = useTranslation();

    useEffect(() => {
        if (props.navigation === props.buttonId) {
            buttonRef.current?.classList.add(SELECTED_CLASS);
        } else {
            buttonRef.current?.classList.remove(SELECTED_CLASS);
        }
    }, [props.navigation]);

    return (
        <button
            ref={buttonRef}
            onClick={() => props.setNavigation(props.buttonId)}
        >
            {props.icon} {t(`home.navigation.buttons.${props.buttonId}`)}
        </button>
    );
};
