import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from "src/common";

import { TranslateDto } from "./dto";
import { TranslateService } from "./translate.service";

@Controller("translate")
@UseGuards(JwtAuthGuard)
export class TranslateController {
	constructor(private readonly translateService: TranslateService) {}

	@Post()
	translate(@Req() req: any, @Body() dto: TranslateDto) {
		return this.translateService.translate(dto);
	}
}
