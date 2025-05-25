import { Dispatch, ReactNode, SetStateAction } from "react";
import { MdAdd, MdComment, MdFilePresent, MdHistory, MdMenuBook, MdTranslate } from "react-icons/md";

export type NavigationItem = {
    readonly id: string;
    readonly icon: ReactNode;
    readonly nestedNav?: NavigationRecord;
}
type NavigationRecord = Record<string, NavigationItem>;
export const NAVIGATION = {
    NEW: {
        id: "new",
        icon: <MdAdd />,
        nestedNav: {
            FILES: {
                id: "files",
                icon: <MdFilePresent />,
            },
            NOTES: {
                id: "notes",
                icon: <MdComment />,
            },
            VOCABULARY: {
                id: "vocabulary",
                icon: <MdTranslate />,
            },
        },
    },
    OLD: {
        id: "old",
        icon: <MdHistory />,
    },
    DIC: {
        id: "dic",
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
