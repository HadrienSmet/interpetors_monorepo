import { createContext, Dispatch, SetStateAction, useContext } from "react";

import { getContextError } from "../messageError";

import { DeviceInfo } from "./getters";
import { DimensionsType } from "./hooks";

export type EnvironmentContextValue = {
    readonly dimensions: DimensionsType;
    readonly deviceInfo: DeviceInfo;
    readonly scroll: {
        value: number;
        setter: Dispatch<SetStateAction<number>>;
    };
};

export const EnvironmentContext = createContext<EnvironmentContextValue | null>(null);

/**
 * @description Context that shares the execution environment infos (dimensions, deviceInfo, ...) 
 */
export const useEnvironment = (): EnvironmentContextValue => {
    const context = useContext(EnvironmentContext);

    if (!context) throw new Error(getContextError("useEnvironment", "EnvironmentProvider"));

    return (context);
};
