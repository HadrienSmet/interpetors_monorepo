import { ReactNode } from "react";
import { PiBookOpen, PiGear, PiGraduationCap, PiHouse, PiPlus } from "react-icons/pi";

export type NavigationItem = {
    readonly icon: ReactNode;
    readonly id: string;
    readonly nestedNav?: NavigationRecord;
};
type NavigationRecord = Record<string, NavigationItem>;
const ICON_SIZE = 28 as const;
export const NAVIGATION = {
    HOME: {
        icon: <PiHouse size={ICON_SIZE} />,
        id: "home",
    },
    PREPARATIONS: {
        icon: <PiGraduationCap size={ICON_SIZE} />,
        id: "preparations",
		nestedNav: {
            NEW: {
                icon: <PiPlus />,
                id: "new",
            },
        },
    },
    DICTIONARY: {
        icon: <PiBookOpen size={ICON_SIZE} />,
        id: "dictionary",
    },
	SETTINS: {
		icon: <PiGear size = {ICON_SIZE} />,
		id: "settings",
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
