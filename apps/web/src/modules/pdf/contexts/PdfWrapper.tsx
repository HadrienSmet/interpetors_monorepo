import { PropsWithChildren } from "react";

import { PdfCanvasProvider } from "./canvas";
import { PdfFileProvider } from "./file";
import { PdfHistoryProvider } from "./history";
import { PdfNotesProvider } from "./notes";
import { PdfToolsProvider } from "./tools";

export const PdfWrapper = ({ children }: PropsWithChildren) => (
    <PdfFileProvider>
        <PdfHistoryProvider>
            <PdfToolsProvider>
                <PdfCanvasProvider>
                    <PdfNotesProvider>
                        {children}
                    </PdfNotesProvider>
                </PdfCanvasProvider>
            </PdfToolsProvider>
        </PdfHistoryProvider>
    </PdfFileProvider>
);
