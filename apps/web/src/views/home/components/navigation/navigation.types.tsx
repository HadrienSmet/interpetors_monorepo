import { Dispatch, SetStateAction } from "react";
import { FaBook, FaHistory, FaPlus } from "react-icons/fa";

export const NAVIGATION = {
    NEW: {
        id: "new",
        icon: <FaPlus />,
    },
    OLD: {
        id: "old",
        icon: <FaHistory />,
    },
    VOC: {
        id: "voc",
        icon: <FaBook />,
    },
} as const;
export type NavigationState = typeof NAVIGATION[keyof typeof NAVIGATION]["id"];

export type NavigationProps = {
    readonly homeNavigation: NavigationState;
    readonly setHomeNavigation: Dispatch<SetStateAction<NavigationState>>;
};
