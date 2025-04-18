import { Dispatch, SetStateAction } from "react";
import { MdAdd, MdHistory, MdMenuBook } from "react-icons/md";

export const NAVIGATION = {
    NEW: {
        id: "new",
        icon: <MdAdd />,
    },
    OLD: {
        id: "old",
        icon: <MdHistory />,
    },
    VOC: {
        id: "voc",
        icon: <MdMenuBook />,
    },
} as const;
export type NavigationState = typeof NAVIGATION[keyof typeof NAVIGATION]["id"];

export type NavigationProps = {
    readonly navigation: NavigationState;
    readonly setNavigation: Dispatch<SetStateAction<NavigationState>>;
};
