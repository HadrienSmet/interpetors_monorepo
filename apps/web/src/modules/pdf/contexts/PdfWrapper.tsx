import { PropsWithChildren, RefObject } from "react";

import { PdfCanvasProvider } from "./canvas";
import { PdfFileProvider } from "./file";
import { PdfHistoryProvider } from "./history";
import { PdfNotesProvider } from "./notes";
import { PdfToolsProvider } from "./tools";

type PdfWrapperProps =
    & { readonly scrollableParentRef: RefObject<HTMLDivElement | null>; }
    & PropsWithChildren;
export const PdfWrapper = ({ children, ...props }: PdfWrapperProps) => (
    <PdfFileProvider {...props}>
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
