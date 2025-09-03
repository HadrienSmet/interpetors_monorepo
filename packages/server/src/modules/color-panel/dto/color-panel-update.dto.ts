import { PartialType } from "@nestjs/mapped-types";

import { CreateColorPanelDto } from "./color-panel-create.dto";

export class UpdateColorPanelDto extends PartialType(CreateColorPanelDto) {}
