import { PropsWithChildren } from "react";

import { PdfCanvasProvider } from "./canvas";
import { PdfFileProvider } from "./file";
import { PdfHistoryProvider } from "./history";
import { PdfToolsProvider } from "./tools";

export const PdfWrapper = ({ children }: PropsWithChildren) => (
    <PdfFileProvider>
        <PdfHistoryProvider>
            <PdfToolsProvider>
                <PdfCanvasProvider>
                    {children}
                </PdfCanvasProvider>
            </PdfToolsProvider>
        </PdfHistoryProvider>
    </PdfFileProvider>
);
