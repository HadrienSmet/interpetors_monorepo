import { ReactNode } from "react";
import { MdAdd, MdHistory, MdHome, MdMenuBook, MdOtherHouses } from "react-icons/md";

export type NavigationItem = {
    readonly icon: ReactNode;
    readonly id: string;
    readonly nestedNav?: NavigationRecord;
};
type NavigationRecord = Record<string, NavigationItem>;
export const NAVIGATION = {
    HOME: {
        icon: <MdHome />,
        id: "home",
    },
    WORKSPACES: {
        icon: <MdOtherHouses />,
        id: "workspaces",
    },
    PREPARATIONS: {
        icon: <MdHistory />,
        id: "preparations",
        nestedNav: {
            NEW: {
                icon: <MdAdd />,
                id: "new",
            },
        },
    },
    DICTIONARY: {
        icon: <MdMenuBook />,
        id: "dictionary",
    },
} as const;

type ExtractPaths<T extends NavigationRecord> = {
    [K in keyof T]: T[K] extends { id: infer ID extends string }
        ? T[K] extends { nestedNav: NavigationRecord }
            ? [ID, ...ExtractPaths<T[K]["nestedNav"]>]
            : [ID]
        : never;
}[keyof T];

export type NavigationState = ExtractPaths<typeof NAVIGATION>;
