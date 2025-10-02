import { saveAs } from "file-saver";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";

import { ClientFolderStructure, ClientPdfFile } from "@repo/types";

import { handleSaveChanges } from "@/modules/pdf";
import { ColorPanelType } from "@/modules/colorPanel";

const generatePdfBytes = async (file: ClientPdfFile, colorPanel: ColorPanelType | null): Promise<Uint8Array> => {
    const arrayBuffer = typeof file.file === "string"
        ? await fetch(file.file).then(res => res.arrayBuffer())
        : await file.file.arrayBuffer();

    const pdfDoc = await PDFDocument.load(arrayBuffer);

    const numPages = pdfDoc.getPages().length;

    await handleSaveChanges(file, pdfDoc, numPages, colorPanel);

    return (pdfDoc.save());
};

const addToZip = async (zip: JSZip, folder: ClientFolderStructure, colorPanel: ColorPanelType | null, path = "") => {
    for (const [key, value] of Object.entries(folder)) {
        if ("file" in value) {
            const file = value as ClientPdfFile;
            const pdfBytes = await generatePdfBytes(file, colorPanel);
            zip.file(`${path}${key}.pdf`, pdfBytes);
        } else {
            const subfolder = zip.folder(`${path}${key}/`);
            if (subfolder) {
                await addToZip(subfolder, value as ClientFolderStructure, colorPanel, "");
            }
        }
    }
};

export const downloadFolderAsZip = async (structures: Array<ClientFolderStructure>, colorPanel: ColorPanelType | null, zipName = "documents.zip") => {
    const zip = new JSZip();

    for (const structure of structures) {
        await addToZip(zip, structure, colorPanel);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });

    saveAs(zipBlob, zipName);
};
