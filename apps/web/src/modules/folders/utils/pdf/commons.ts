import { PDFDocument } from "pdf-lib";

import { PDF_TYPE } from "./constants";

/**
 * Dowloads an updated pdf file
 * @param pdfDoc Instance of PDFDocument
 * @param filename Name of the file to download
 */
export const downloadPdf = async (pdfDoc: PDFDocument, filename = "document.pdf") => {
    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], PDF_TYPE);

    // Créer une URL pour ce Blob
    const url = URL.createObjectURL(blob);

    // Créer un lien temporaire pour déclencher le téléchargement
    const link = document.createElement("a");
    link.href = url;
    link.download = `updated_${filename}`;

    // Cliquer sur le lien pour démarrer le téléchargement
    document.body.appendChild(link);
    link.click();

    // Nettoyer
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
