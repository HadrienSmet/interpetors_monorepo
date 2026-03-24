import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import { VocabularyTerm } from "@repo/types";

import { ColorPanelType } from "@/modules/colorPanel";
import { HIGLIGHT_OPACITY } from "@/modules/files";
import { blendWithWhite, getRgbColor, handleActionColor, rgbStringToHex } from "@/utils";

const BORDER_COLOR = "FF000000";
const BORDER_STYLE = "thin";
const CELL_HEIGHT = 25 as const;
const CELL_WIDTH = 50 as const;
const HEADER_HEIGHT = 30 as const;

export const downloadVocabulary = async (list: Array<VocabularyTerm>, header: Array<string>, colorPanel: ColorPanelType | null, filename = "vocabulary.xlsx") => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Vocabulaire");

    sheet.addRow(header);
    sheet.getRow(1).height = HEADER_HEIGHT;
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };

    sheet.columns = header.map(() => ({ width: CELL_WIDTH }));

    list.forEach((voc) => {
		const rowValues = [voc.occurrence.text,...Object.values(voc.translations)];
        const row = sheet.addRow(rowValues);

        row.height = CELL_HEIGHT;

        row.eachCell((cell) => {
            const rgbColor = handleActionColor(voc.color, colorPanel);
            const color = getRgbColor(rgbColor);

            cell.fill = {
                fgColor: { argb: rgbStringToHex(blendWithWhite(color, HIGLIGHT_OPACITY)) },
                pattern: "solid",
                type: "pattern",
            };

            cell.alignment = {
                horizontal: "center",
                vertical: "middle",
                wrapText: true,
            };

            cell.border = {
                bottom: { style: BORDER_STYLE, color: { argb: BORDER_COLOR } },
                left: { style: BORDER_STYLE, color: { argb: BORDER_COLOR } },
                right: { style: BORDER_STYLE, color: { argb: BORDER_COLOR } },
                top: { style: BORDER_STYLE, color: { argb: BORDER_COLOR } },
            };
        });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(new Blob([buffer]), filename);
};
