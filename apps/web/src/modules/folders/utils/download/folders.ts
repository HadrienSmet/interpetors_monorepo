import { saveAs } from "file-saver";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";

import { FileInStructure, FolderStructure } from "../../types";

import { handleSaveChanges } from "./files";

const generatePdfBytes = async (file: FileInStructure): Promise<Uint8Array> => {
    const arrayBuffer = typeof file.file === "string"
        ? await fetch(file.file).then(res => res.arrayBuffer())
        : await file.file.arrayBuffer();

    const pdfDoc = await PDFDocument.load(arrayBuffer);

    const numPages = pdfDoc.getPages().length;

    await handleSaveChanges(file, pdfDoc, numPages);

    return (pdfDoc.save());
};

const addToZip = async (zip: JSZip, folder: FolderStructure, path = "") => {
    for (const [key, value] of Object.entries(folder)) {
        if ("file" in value) {
            const file = value as FileInStructure;
            const pdfBytes = await generatePdfBytes(file);
            zip.file(`${path}${key}.pdf`, pdfBytes);
        } else {
            const subfolder = zip.folder(`${path}${key}/`);
            if (subfolder) {
                await addToZip(subfolder, value as FolderStructure, "");
            }
        }
    }
};

export const downloadFolderAsZip = async (structures: Array<FolderStructure>, zipName = "documents.zip") => {
    const zip = new JSZip();

    for (const structure of structures) {
        await addToZip(zip, structure);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });

    saveAs(zipBlob, zipName);
};
