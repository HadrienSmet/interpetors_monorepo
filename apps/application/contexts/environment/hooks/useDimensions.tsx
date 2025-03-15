import { useEffect, useState } from "react"
import { Dimensions } from "react-native";

export type DimensionsType = {
    readonly height: number | null;
    readonly width: number | null;
};
export const useDimensions = () => {
    const [dimensions, setDimensions] = useState<DimensionsType>({ height: null, width: null });

    useEffect(() => {
        setDimensions(Dimensions.get("window"));

        const listener = Dimensions.addEventListener("change", ({ window }) => setDimensions(window));
        return () => {
            listener.remove();
        }
    }, []);

    return (dimensions);
};
