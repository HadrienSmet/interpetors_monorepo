import { rgb } from "pdf-lib";

import { RgbColor } from "@/utils";

export const getPdfRgbColor = (color: RgbColor) => rgb(color.r, color.g, color.b);
