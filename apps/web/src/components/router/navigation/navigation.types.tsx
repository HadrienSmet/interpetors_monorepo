import { Dispatch, ReactNode, SetStateAction } from "react";
import { MdAdd, MdApps, MdFilePresent, MdHistory, MdHome, MdMenuBook, MdTranslate } from "react-icons/md";

export type NavigationItem = {
    readonly id: string;
    readonly icon: ReactNode;
    readonly nestedNav?: NavigationRecord;
};
type NavigationRecord = Record<string, NavigationItem>;
export const NAVIGATION = {
    HOME: {
        id: "home",
        icon: <MdHome />,
    },
    PREPARE: {
        id: "prepare",
        icon: <MdAdd />,
        nestedNav: {
            HOME: {
                id: "manager",
                icon: <MdApps />,
            },
            FILES: {
                id: "files",
                icon: <MdFilePresent />,
            },
            VOCABULARY: {
                id: "vocabulary",
                icon: <MdTranslate />,
            },
        },
    },
    PREPARATIONS: {
        id: "preparations",
        icon: <MdHistory />,
    },
    DICTIONARY: {
        id: "dictionary",
        icon: <MdMenuBook />,
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


export type NavigationProps = {
    readonly navigation: NavigationState;
    readonly setNavigation: Dispatch<SetStateAction<NavigationState>>;
};
