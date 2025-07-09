import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import { HIGLIGHT_OPACITY, PdfVocabulary } from "@/modules/folders";
import { blendWithWhite, rgbStringToHex } from "@/utils";

const BORDER_COLOR = "FF000000";
const BORDER_STYLE = "thin";
const CELL_HEIGHT = 25 as const;
const CELL_WIDTH = 50 as const;
const HEADER_HEIGHT = 30 as const;

export const downloadVocabulary = async (list: Array<PdfVocabulary>, header: Array<string>, filename = "vocabulary.xlsx") => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Vocabulaire");

    const languages = Object.keys(list[0]?.translations || {});

    sheet.addRow(header);
    sheet.getRow(1).height = HEADER_HEIGHT;
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };

    sheet.columns = header.map(() => ({
        width: CELL_WIDTH,
    }));

    list.forEach((voc) => {
        const rowValues = [
            voc.occurence.text,
            ...languages.map(lang => voc.translations[lang] || ""),
        ];
        const row = sheet.addRow(rowValues);

        row.height = CELL_HEIGHT;

        row.eachCell((cell) => {
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: rgbStringToHex(blendWithWhite(voc.color, HIGLIGHT_OPACITY)) },
            };

            cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };

            cell.border = {
                top: { style: BORDER_STYLE, color: { argb: BORDER_COLOR } },
                left: { style: BORDER_STYLE, color: { argb: BORDER_COLOR } },
                bottom: { style: BORDER_STYLE, color: { argb: BORDER_COLOR } },
                right: { style: BORDER_STYLE, color: { argb: BORDER_COLOR } },
            };
        });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(new Blob([buffer]), filename);
};
