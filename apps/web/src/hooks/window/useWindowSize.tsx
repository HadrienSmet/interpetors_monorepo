import { useEffect, useState } from "react";

import { Dimensions } from "@/types";

export const useWindowSize = () => {
    const [size, setSize] = useState<Dimensions>({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (size);
};
