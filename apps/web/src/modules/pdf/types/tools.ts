import { PDF_TOOLS } from "@/modules/files";

export type PdfTool = typeof PDF_TOOLS[keyof typeof PDF_TOOLS];
