import { PropsWithChildren } from "react";

import { PdfCanvasProvider } from "./canvas";
import { PdfFileProvider } from "./file";
import { PdfHistoryProvider } from "./history";
import { PdfToolsProvider } from "./tools";
import { PdfFileInStructure } from "./types";

type PdfWrapperProps =
    & {
        readonly fileInStructure: PdfFileInStructure;
        readonly filePath: string;
    }
    & PropsWithChildren;
export const PdfWrapper = ({ children, ...props }: PdfWrapperProps) => (
    <PdfHistoryProvider>
        <PdfFileProvider {...props}>
            <PdfToolsProvider>
                <PdfCanvasProvider>
                    {children}
                </PdfCanvasProvider>
            </PdfToolsProvider>
        </PdfFileProvider>
    </PdfHistoryProvider>
);
