"use client";

import { useEffect, useRef } from "react";

import { useTranslation } from "@/contexts";

import { NavigationProps, NavigationState } from "./navigation.types";

type NavigationButtonProps =
    & {
        readonly buttonId: NavigationState;
        readonly icon: JSX.Element;
    }
    & NavigationProps;

const SELECTED_CLASS = "selected";
export const NavigationButton = (props: NavigationButtonProps) => {
    const buttonRef = useRef<HTMLButtonElement>(null);

    const { t } = useTranslation();

    useEffect(() => {
        if (props.homeNavigation === props.buttonId) {
            buttonRef.current?.classList.add(SELECTED_CLASS);
        } else {
            buttonRef.current?.classList.remove(SELECTED_CLASS);
        }
    }, [props.homeNavigation]);

    return (
        <button
            ref={buttonRef}
            onClick={() => props.setHomeNavigation(props.buttonId)}
        >
            {props.icon} {t(`home.navigation.buttons.${props.buttonId}`)}
        </button>
    );
};
