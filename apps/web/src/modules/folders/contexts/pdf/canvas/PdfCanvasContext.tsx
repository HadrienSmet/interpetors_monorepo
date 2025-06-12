import { createContext, RefObject, useContext } from "react";

import { getContextError } from "@/contexts/utils";

export type PdfCanvasContextType = {
    readonly canvasRef: RefObject<HTMLCanvasElement | null>;
    readonly clear: () => void;
};
export const PdfCanvasContext = createContext<PdfCanvasContextType | null>(null);
export const usePdfCanvas = () => {
    const context = useContext(PdfCanvasContext);

    if (!context) {
        throw new Error(getContextError("usePdfCanvas", "PdfCanvasProvider"));
    }

    return (context);
};
