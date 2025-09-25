import { OTHER_TOOLS, TOOLS_ON_SELECTION } from "@/modules/files/types";

export const PDF_TOOLS = { ...TOOLS_ON_SELECTION, ...OTHER_TOOLS };
export type PdfTool = typeof PDF_TOOLS[keyof typeof PDF_TOOLS];
