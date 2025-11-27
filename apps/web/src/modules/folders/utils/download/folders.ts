import { saveAs } from "file-saver";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";

import { FolderStructure, PdfFile } from "@repo/types";

import { ColorPanelType } from "@/modules/colorPanel";
import { handleSaveChanges } from "@/modules/pdf";

export const getPdfDocument = async (file: File) => {
    const arrayBuffer = typeof file === "string"
        ? await fetch(file).then(res => res.arrayBuffer())
        : await file.arrayBuffer();

    const pdfDoc = await PDFDocument.load(arrayBuffer);

    return (pdfDoc);
};
const generatePdfBytes = async (file: PdfFile, colorPanel: ColorPanelType | null): Promise<Uint8Array> => {
    const pdfDoc = await getPdfDocument(file.file);

    const numPages = pdfDoc.getPages().length;

    await handleSaveChanges(file, pdfDoc, numPages, colorPanel);

    return (pdfDoc.save());
};
const addToZip = async (zip: JSZip, folder: FolderStructure, colorPanel: ColorPanelType | null, path = "") => {
    for (const [key, value] of Object.entries(folder)) {
        if ("file" in value) {
            const file = value as PdfFile;
            const pdfBytes = await generatePdfBytes(file, colorPanel);

            zip.file(`${path}${key}.pdf`, pdfBytes);
        } else {
            const subfolder = zip.folder(`${path}${key}/`);
            if (subfolder) {
                await addToZip(subfolder, value as FolderStructure, colorPanel, "");
            }
        }
    }
};
export const downloadFolderAsZip = async (structures: Array<FolderStructure>, colorPanel: ColorPanelType | null, zipName = "documents.zip") => {
    const zip = new JSZip();

    for (const structure of structures) {
        await addToZip(zip, structure, colorPanel);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });

    saveAs(zipBlob, zipName);
};
