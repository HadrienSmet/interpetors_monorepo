import { PdfFile } from "@repo/types";

import { FIRST_PAGE } from "@/modules/files";

export const getDefaultPdfActions = () => ({ [FIRST_PAGE]: { elements: [] } });
export const getDefaultPdfFile = (file: File): PdfFile => ({
    actions: getDefaultPdfActions(),
    file,
    id: "",
    name: file.name,
});
